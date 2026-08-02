import { loadConfiguration } from "@knowledgeos/server";
import { startPostgresServer } from "./composition.js";

const running = await startPostgresServer(
  loadConfiguration(process.env),
);

const shutdown = async (): Promise<void> => {
  await running.stop();
};

process.on("SIGINT", () => {
  void shutdown();
});
process.on("SIGTERM", () => {
  void shutdown();
});

console.log(
  `KnowledgeOS PostgreSQL server listening on ${running.address.host}:${running.address.port}`,
);
