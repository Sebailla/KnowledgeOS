import { startFromEnvironment } from "./runtime.js";

const running = await startFromEnvironment(process.env);

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
  `KnowledgeOS server listening on ${running.address.host}:${running.address.port}`,
);
