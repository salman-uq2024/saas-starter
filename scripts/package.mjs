import { execFileSync, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

async function ensureBuild() {
  execSync("npm run build", { stdio: "inherit" });
}

async function createZip() {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const distDir = path.join(root, "dist");
  await fs.mkdir(distDir, { recursive: true });

  let gitSha = "nogit";
  try {
    gitSha = execSync("git rev-parse --short HEAD", { cwd: root, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch (error) {
    // ignore
  }

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  const zipName = `saas-starter-${formattedDate}-${gitSha}.zip`;
  const zipPath = path.join(distDir, zipName);
  const shaPath = path.join(distDir, `${zipName}.sha256.txt`);

  const packageList = [
    ".next",
    "public",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "src",
    "prisma",
    "docs",
    "README.md",
    "playwright.config.ts",
    "vitest.config.ts",
    "scripts",
    "tests",
    ".github",
    ".env.example",
  ];

  const existing = packageList.filter((item) => existsSync(path.join(root, item)));

  if (existsSync(zipPath)) {
    await fs.rm(zipPath);
  }
  if (existsSync(shaPath)) {
    await fs.rm(shaPath);
  }

  if (existing.length === 0) {
    throw new Error("No build artifacts found to package.");
  }

  execFileSync("zip", ["-r", zipPath, ...existing], { cwd: root, stdio: "inherit" });

  const fileBuffer = await fs.readFile(zipPath);
  const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  await fs.writeFile(shaPath, `${hash}  ${zipName}`);

  return { zipPath, shaPath };
}

async function main() {
  await ensureBuild();
  const { zipPath, shaPath } = await createZip();
  console.log(`Packaged application at ${zipPath}`);
  console.log(`SHA256 written to ${shaPath}`);
}

await main();
