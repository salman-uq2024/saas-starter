type LogLevel = "debug" | "info" | "warn" | "error";

const levelWeights: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL = (process.env.LOG_LEVEL as LogLevel | undefined) ?? "info";
const minWeight = levelWeights[MIN_LEVEL] ?? levelWeights.info;

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (levelWeights[level] < minWeight) {
    return;
  }
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  if (level === "error") {
    console.error(JSON.stringify(payload));
  } else if (level === "warn") {
    console.warn(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
};
