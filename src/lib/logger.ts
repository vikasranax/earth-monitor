/**
 * Structured logger. JSON lines in production (machine-parseable),
 * human-readable lines in development. No PII in log messages — ever.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const threshold: number =
  LEVELS[(process.env.LOG_LEVEL as LogLevel | undefined) ?? "info"] ??
  (process.env.NODE_ENV === "production" ? LEVELS.info : LEVELS.debug);

interface LogMeta {
  [key: string]: unknown;
}

function emit(level: LogLevel, scope: string, msg: string, meta?: LogMeta): void {
  if (LEVELS[level] < threshold) return;

  if (process.env.NODE_ENV === "production") {
    const line = JSON.stringify({ ts: new Date().toISOString(), level, scope, msg, ...meta });
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else process.stdout.write(line + "\n");
    return;
  }

  const time = new Date().toISOString().slice(11, 23);
  const text = `[${time}] ${level.toUpperCase().padEnd(5)} (${scope}) ${msg}${
    meta ? " " + JSON.stringify(meta) : ""
  }`;
  if (level === "error") console.error(text);
  else if (level === "warn") console.warn(text);
  else process.stdout.write(text + "\n");
}

export interface Logger {
  debug: (msg: string, meta?: LogMeta) => void;
  info: (msg: string, meta?: LogMeta) => void;
  warn: (msg: string, meta?: LogMeta) => void;
  error: (msg: string, meta?: LogMeta) => void;
}

export function createLogger(scope: string): Logger {
  return {
    debug: (msg, meta) => emit("debug", scope, msg, meta),
    info: (msg, meta) => emit("info", scope, msg, meta),
    warn: (msg, meta) => emit("warn", scope, msg, meta),
    error: (msg, meta) => emit("error", scope, msg, meta),
  };
}