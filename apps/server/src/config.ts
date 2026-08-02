export interface ServerConfiguration {
  readonly host: string;
  readonly port: number;
  readonly environment: "development" | "test" | "production";
  readonly databaseUrl: string;
  readonly requestBodyLimitBytes: number;
}

function parsePort(value: string | undefined): number {
  const parsed = Number(value ?? "3000");
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error("SERVER_PORT must be an integer between 1 and 65535");
  }
  return parsed;
}

function parseBodyLimit(value: string | undefined): number {
  const parsed = Number(value ?? "1048576");
  if (!Number.isInteger(parsed) || parsed < 1024) {
    throw new Error("REQUEST_BODY_LIMIT_BYTES must be at least 1024");
  }
  return parsed;
}

export function loadConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): ServerConfiguration {
  const runtime = environment.NODE_ENV ?? "development";
  if (!["development", "test", "production"].includes(runtime)) {
    throw new Error(`Unsupported NODE_ENV: ${runtime}`);
  }

  const databaseUrl = environment.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  return Object.freeze({
    host: environment.SERVER_HOST ?? "127.0.0.1",
    port: parsePort(environment.SERVER_PORT),
    environment: runtime as ServerConfiguration["environment"],
    databaseUrl,
    requestBodyLimitBytes: parseBodyLimit(
      environment.REQUEST_BODY_LIMIT_BYTES,
    ),
  });
}
