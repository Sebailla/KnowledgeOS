import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

const docker = process.env.DOCKER_BIN ?? "docker";
const suffix = randomUUID().slice(0, 8);
const network = `knowledgeos-processing-${suffix}`;
const databaseContainer = `knowledgeos-processing-db-${suffix}`;
const workerContainer = `knowledgeos-processing-worker-${suffix}`;
const database = "knowledgeos_processing";
const user = "knowledgeos_processing";
const password = "knowledgeos_processing";
const root = new URL("../../..", import.meta.url).pathname;
const databaseUrl = `postgresql://${user}:${password}@postgres:5432/${database}`;

function run(command, args, options = {}) {
  return spawnSync(command, args, { encoding: "utf8", ...options });
}

function requireSuccess(result, message) {
  if (result.status !== 0) {
    throw new Error(`${message}\n${result.stderr || result.stdout || "unknown failure"}`);
  }
}

async function waitForPostgres() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (run(docker, ["exec", databaseContainer, "pg_isready", "-U", user, "-d", database]).status === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error("PostgreSQL container did not become ready within 30 seconds.");
}

async function waitForWorkerCheckpoint() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const logs = run(docker, ["logs", workerContainer]);
    if (logs.stdout.includes("leased-checkpointed")) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Interrupted worker did not persist its checkpoint.");
}

const available = run(docker, ["version", "--format", "{{.Server.Version}}"]).status === 0;
if (!available) {
  process.stderr.write("Docker is required for @knowledgeos/master-storage test:recovery. Start Docker and retry.\n");
  process.exitCode = 1;
} else {
  try {
    requireSuccess(run(docker, ["network", "create", network]), "Could not create the isolated worker network.");
    requireSuccess(run(docker, [
      "run", "--rm", "-d", "--name", databaseContainer, "--network", network, "--network-alias", "postgres",
      "-e", `POSTGRES_DB=${database}`, "-e", `POSTGRES_USER=${user}`, "-e", `POSTGRES_PASSWORD=${password}`,
      "postgres:17-alpine",
    ]), "Could not start the processing PostgreSQL container.");
    await waitForPostgres();
    requireSuccess(run(docker, [
      "run", "-d", "--name", workerContainer, "--network", network,
      "-e", `MASTER_STORAGE_TEST_DATABASE_URL=${databaseUrl}`, "-e", "PROCESSING_WORKER_MODE=interrupt",
      "-v", `${root}:/workspace:ro`, "-w", "/workspace/packages/master-storage",
      "node:22-alpine", "node", "scripts/interrupted-worker.mjs",
    ]), "Could not start the first processing worker container.");
    await waitForWorkerCheckpoint();
    requireSuccess(run(docker, ["kill", workerContainer]), "Could not kill the interrupted worker container.");
    const recovery = run(docker, [
      "run", "--rm", "--network", network,
      "-e", `MASTER_STORAGE_TEST_DATABASE_URL=${databaseUrl}`, "-e", "PROCESSING_WORKER_MODE=recover",
      "-v", `${root}:/workspace:ro`, "-w", "/workspace/packages/master-storage",
      "node:22-alpine", "node", "scripts/interrupted-worker.mjs",
    ]);
    requireSuccess(recovery, "Recreated worker did not resume the interrupted lease exactly once.");
    if (!recovery.stdout.includes("recovered-once")) {
      throw new Error("Recreated worker did not report a completed recovery.");
    }
    process.stdout.write(recovery.stdout);
    process.stdout.write("worker-container-kill-recreate-resume: passed\n");
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  } finally {
    run(docker, ["rm", "-f", workerContainer]);
    run(docker, ["rm", "-f", databaseContainer]);
    run(docker, ["network", "rm", network]);
  }
}
