import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { recordAuditLog } from "@/server/workspaces";

const stripeClient = (() => {
  const env = getServerEnv();
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
})();

export function getBillingRuntimeInfo() {
  const env = getServerEnv();
  const hasSecret = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID_PRO);
  const hasWebhook = Boolean(env.STRIPE_WEBHOOK_SECRET);
  return {
    mode: hasSecret && stripeClient ? ("live" as const) : ("stub" as const),
    webhookConfigured: hasWebhook && hasSecret && Boolean(stripeClient),
  };
}

type CheckoutResult = {
  url: string;
  mode: "live" | "stub";
};

type PortalResult = {
  url: string;
  mode: "live" | "stub";
};

async function ensureWorkspace(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) {
    throw new Error("Workspace not found");
  }
  return workspace;
}

async function findWorkspaceIdByCustomer(customer: string | Stripe.Customer | null | undefined) {
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (!customerId) {
    return null;
  }
  const workspace = await prisma.workspace.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });
  return workspace?.id ?? null;
}

async function findWorkspaceIdBySubscription(subscription: string | Stripe.Subscription | null | undefined) {
  const subscriptionId = typeof subscription === "string" ? subscription : subscription?.id;
  if (!subscriptionId) {
    return null;
  }
  const workspace = await prisma.workspace.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    select: { id: true },
  });
  return workspace?.id ?? null;
}

async function ensureStripeCustomer(workspaceId: string): Promise<string> {
  const workspace = await ensureWorkspace(workspaceId);

  if (workspace.stripeCustomerId) {
    return workspace.stripeCustomerId;
  }

  if (!stripeClient) {
    const fakeCustomerId = `stub_cus_${workspaceId}`;
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        stripeCustomerId: fakeCustomerId,
      },
    });
    return fakeCustomerId;
  }

  const customer = await stripeClient.customers.create({
    name: workspace.name,
    metadata: {
      workspaceId,
    },
  });

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  logger.info("Stripe customer created", { workspaceId, customerId: customer.id });

  return customer.id;
}

export async function createCheckoutSession(params: {
  workspaceId: string;
  actorId: string;
}): Promise<CheckoutResult> {
  const env = getServerEnv();
  const workspace = await ensureWorkspace(params.workspaceId);

  if (!stripeClient || !env.STRIPE_PRICE_ID_PRO || !env.STRIPE_SECRET_KEY) {
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        plan: "PRO",
        billingStatus: "ACTIVE",
        stripeSubscriptionId: `stub_sub_${workspace.id}`,
        subscriptionStatusChangedAt: new Date(),
      },
    });

    await recordAuditLog({
      workspaceId: workspace.id,
      actorId: params.actorId,
      action: "billing.stub.upgraded",
    });

    return {
      url: `${env.APP_URL}/billing/success?workspaceId=${workspace.id}&mode=stub`,
      mode: "stub",
    };
  }

  const customerId = await ensureStripeCustomer(workspace.id);

  const session = await stripeClient.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    subscription_data: {
      metadata: {
        workspaceId: workspace.id,
      },
    },
    metadata: {
      workspaceId: workspace.id,
    },
    success_url: `${env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/settings/billing`,
    line_items: [
      {
        price: env.STRIPE_PRICE_ID_PRO,
        quantity: 1,
      },
    ],
  });

  await recordAuditLog({
    workspaceId: workspace.id,
    actorId: params.actorId,
    action: "billing.checkout.created",
    metadata: { sessionId: session.id },
  });

  return {
    url: session.url!,
    mode: "live",
  };
}

export async function createBillingPortalSession(params: {
  workspaceId: string;
  actorId: string;
}): Promise<PortalResult> {
  const env = getServerEnv();
  const workspace = await ensureWorkspace(params.workspaceId);

  if (!stripeClient || !env.STRIPE_SECRET_KEY) {
    await recordAuditLog({
      workspaceId: workspace.id,
      actorId: params.actorId,
      action: "billing.stub.portal",
    });

    return {
      url: `${env.APP_URL}/billing/portal?workspaceId=${workspace.id}&mode=stub`,
      mode: "stub",
    };
  }

  const customerId = await ensureStripeCustomer(workspace.id);

  const session = await stripeClient.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.APP_URL}/settings/billing`,
  });

  await recordAuditLog({
    workspaceId: workspace.id,
    actorId: params.actorId,
    action: "billing.portal.created",
    metadata: { portalSessionId: session.id },
  });

  return {
    url: session.url,
    mode: "live",
  };
}

export async function handleStripeWebhook(rawBody: string | Buffer, signature?: string) {
  const env = getServerEnv();

  if (!stripeClient || !env.STRIPE_WEBHOOK_SECRET) {
    logger.info("Skipping webhook handling (stub mode)");
    return { received: true, mode: "stub" as const };
  }

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(rawBody, signature ?? "", env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    logger.error("Invalid Stripe signature", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Invalid Stripe signature");
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      let workspaceId = session.metadata?.workspaceId ?? null;
      const subscriptionId = (typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id) ?? null;
      const customerId = (typeof session.customer === "string"
        ? session.customer
        : session.customer?.id) ?? null;

      if (!workspaceId && subscriptionId && stripeClient) {
        try {
          const subscription = await stripeClient.subscriptions.retrieve(subscriptionId, {
            expand: ["customer"],
          });
          workspaceId = (subscription.metadata?.workspaceId as string | undefined) ?? null;
          if (!workspaceId) {
            workspaceId = await findWorkspaceIdByCustomer(subscription.customer as string | Stripe.Customer);
          }
        } catch (error) {
          logger.warn("Failed to retrieve subscription metadata", {
            subscriptionId,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      if (!workspaceId && customerId) {
        workspaceId = await findWorkspaceIdByCustomer(customerId);
      }

      if (workspaceId && subscriptionId) {
        await prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            plan: "PRO",
            billingStatus: "ACTIVE",
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
            subscriptionStatusChangedAt: new Date(),
          },
        });
        await recordAuditLog({
          workspaceId,
          action: "billing.subscription.active",
          metadata: { subscriptionId },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      let workspaceId: string | null = (subscription.metadata?.workspaceId as string | undefined) ?? null;
      if (!workspaceId) {
        workspaceId = await findWorkspaceIdBySubscription(subscription.id);
      }
      if (!workspaceId) {
        workspaceId = await findWorkspaceIdByCustomer(subscription.customer as string | Stripe.Customer);
      }
      if (workspaceId) {
        const status =
          subscription.status === "active"
            ? "ACTIVE"
            : subscription.status === "past_due"
            ? "PAST_DUE"
            : "CANCELED";
        await prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            billingStatus: status,
            stripeSubscriptionId: subscription.id,
            subscriptionStatusChangedAt: new Date(),
            plan: status === "CANCELED" ? "FREE" : undefined,
          },
        });
        await recordAuditLog({
          workspaceId,
          action: "billing.subscription.updated",
          metadata: { status: subscription.status },
        });
      }
      break;
    }
    default:
      logger.debug("Unhandled Stripe event", { type: event.type });
  }

  return { received: true, mode: "live" as const };
}

export async function getWorkspaceBillingSummary(workspaceId: string) {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      plan: true,
      billingStatus: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      billingPortalUrl: true,
    },
  });
}
