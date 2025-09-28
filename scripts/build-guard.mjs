import { promises as fs } from "node:fs";
import path from "node:path";

const serverOnlyKeys = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "AUTH_EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID_PRO",
  "APP_URL",
  "RATE_LIMIT_MAX",
  "RATE_LIMIT_WINDOW_MINUTES",
];

const disallowedTokens = serverOnlyKeys.map((key) => `NEXT_PUBLIC_${key}`);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const envFiles = [".env", ".env.local", ".env.example", ".env.test"].map((file) => path.join(root, file));
const ignoreDirs = new Set(["node_modules", ".next", "dist", "build", ".git", "playwright-report"]);
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".md", ".env", ""]);

async function fileContainsToken(filePath, tokens) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return tokens.find((token) => content.includes(token)) ?? null;
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function walk(dir, findings) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, findings);
      continue;
    }
    const ext = path.extname(entry.name);
    if (!allowedExtensions.has(ext)) {
      continue;
    }
    const token = await fileContainsToken(fullPath, disallowedTokens);
    if (token) {
      findings.push({ file: path.relative(root, fullPath), token });
    }
  }
}

async function main() {
  const violations = [];

  for (const file of envFiles) {
    const token = await fileContainsToken(file, disallowedTokens);
    if (token) {
      violations.push({ file: path.relative(root, file), token });
    }
  }

  await walk(root, violations);

  if (violations.length > 0) {
    const details = violations
      .map((violation) => ` - ${violation.token} found in ${violation.file}`)
      .join("\n");
    throw new Error(
      `Build guard detected server-only secrets exposed to the client:\n${details}\nFix the leak or rename the variable to remove the NEXT_PUBLIC_ prefix.`
    );
  }

  console.log("Build guard passed: no server-only secrets exposed to the client.");
}

await main();
