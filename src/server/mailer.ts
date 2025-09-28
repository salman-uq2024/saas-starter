import { createTransport, type Transporter } from "nodemailer";
import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

let cachedTransporter: Transporter | null | undefined;

function buildTransporter(): Transporter | null {
  const env = getServerEnv();
  if (!env.SMTP_HOST) {
    return null;
  }

  return createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASSWORD
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
  });
}

export function getTransporter(): Transporter | null {
  if (cachedTransporter === undefined) {
    cachedTransporter = buildTransporter();
  }
  return cachedTransporter;
}

export type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  tags?: Record<string, unknown>;
};

export async function sendMail(options: MailOptions): Promise<boolean> {
  const env = getServerEnv();
  const transporter = getTransporter();
  const fromAddress = options.from ?? env.AUTH_EMAIL_FROM ?? `no-reply@${new URL(env.APP_URL).hostname}`;

  if (!transporter) {
    logger.info("Email delivery skipped (transporter not configured)", {
      to: options.to,
      subject: options.subject,
      ...options.tags,
    });
    logger.info("Email preview", {
      text: options.text,
      html: options.html,
    });
    return false;
  }

  try {
    await transporter.sendMail({
      ...options,
      from: fromAddress,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send email", {
      to: options.to,
      subject: options.subject,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
