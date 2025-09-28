import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().default("file:./dev.db"),
  AUTH_SECRET: z.string().min(10).default("development-secret"),
  AUTH_EMAIL_FROM: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  STRIPE_PRICE_ID_PRO: z.string().optional(),
  APP_URL: z
    .string()
    .url()
    .default(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  RATE_LIMIT_MAX: z.coerce.number().min(10).default(50),
  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().min(1).default(5),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("SaaS Starter"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;
type PublicEnv = z.infer<typeof publicSchema>;

let serverEnvCache: ServerEnv | null = null;
let publicEnvCache: PublicEnv | null = null;

function sanitize(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value.trim() === "" ? undefined : value;
}

function parseServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not run in the browser");
  }

  if (serverEnvCache) {
    return serverEnvCache;
  }

  const rawServerEnv: Record<string, string | undefined> = {
    DATABASE_URL: sanitize(process.env.DATABASE_URL),
    AUTH_SECRET: sanitize(process.env.AUTH_SECRET),
    AUTH_EMAIL_FROM: sanitize(process.env.AUTH_EMAIL_FROM),
    SMTP_HOST: sanitize(process.env.SMTP_HOST),
    SMTP_PORT: sanitize(process.env.SMTP_PORT),
    SMTP_USER: sanitize(process.env.SMTP_USER),
    SMTP_PASSWORD: sanitize(process.env.SMTP_PASSWORD),
    STRIPE_SECRET_KEY: sanitize(process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: sanitize(process.env.STRIPE_WEBHOOK_SECRET),
    STRIPE_PRICE_ID_PRO: sanitize(process.env.STRIPE_PRICE_ID_PRO),
    APP_URL: sanitize(process.env.APP_URL),
    RATE_LIMIT_MAX: sanitize(process.env.RATE_LIMIT_MAX),
    RATE_LIMIT_WINDOW_MINUTES: sanitize(process.env.RATE_LIMIT_WINDOW_MINUTES),
  };

  const parsed = serverSchema.safeParse(rawServerEnv);
  if (!parsed.success) {
    console.error("Invalid server environment:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Missing or invalid server environment variables.");
  }

  serverEnvCache = parsed.data;
  return serverEnvCache;
}

function parsePublicEnv(): PublicEnv {
  if (publicEnvCache) {
    return publicEnvCache;
  }

  const rawPublicEnv: Record<string, string | undefined> = {
    NEXT_PUBLIC_APP_NAME: sanitize(process.env.NEXT_PUBLIC_APP_NAME),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: sanitize(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  };

  const parsed = publicSchema.safeParse(rawPublicEnv);
  if (!parsed.success) {
    console.error("Invalid public environment:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid public environment variables.");
  }

  publicEnvCache = parsed.data;
  return publicEnvCache;
}

export const SERVER_ONLY_ENV_KEYS = Object.freeze(
  Object.keys(serverSchema.shape) as Array<keyof typeof serverSchema.shape>
);

export const PUBLIC_ENV_KEYS = Object.freeze(
  Object.keys(publicSchema.shape) as Array<keyof typeof publicSchema.shape>
);

export function getServerEnv(): ServerEnv {
  return parseServerEnv();
}

export function getPublicEnv(): PublicEnv {
  return parsePublicEnv();
}
