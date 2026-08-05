import { readFile } from "node:fs/promises";
import { SyncHTTPServer } from "./server.js";

async function token(): Promise<string | undefined> {
  const file = process.env.SYNC_TOKEN_FILE;
  if (file) return (await readFile(file, "utf8")).trim();
  return process.env.SYNC_TOKEN;
}

const configuredToken = await token();
const server = new SyncHTTPServer({
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT ?? 8080),
  ...(configuredToken ? { token: configuredToken } : {}),
});
await server.start();
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => void server.stop().then(() => process.exit(0)));
}
