import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

const env = { ...process.env };

if (!env.PORT) {
  env.PORT = "3100";
}

if (!env.PLAYWRIGHT_WEB_SERVER) {
  env.PLAYWRIGHT_WEB_SERVER = "0";
}

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["playwright", "test"],
  {
    cwd: root,
    env,
    stdio: "inherit",
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
