import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import net from "node:net";

const docker = process.env.DOCKER_BIN ?? "docker";
const name = `knowledgeos-master-storage-${randomUUID().slice(0, 8)}`;
const database = "knowledgeos_pr2";
const user = "knowledgeos_pr2";
const password = "knowledgeos_pr2";

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
    const result = run(docker, ["exec", name, "pg_isready", "-U", user, "-d", database]);
    if (result.status === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error("PostgreSQL container did not become ready within 30 seconds.");
}

async function waitForPublishedPort(port) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const connected = await new Promise((resolve) => {
      const socket = net.connect({ host: "127.0.0.1", port: Number(port) });
      socket.once("connect", () => { socket.destroy(); resolve(true); });
      socket.once("error", () => { socket.destroy(); resolve(false); });
    });
    if (connected) return;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error("Published PostgreSQL TCP port did not become ready within 30 seconds.");
}

const available = run(docker, ["version", "--format", "{{.Server.Version}}"]);
if (available.status !== 0) {
  process.stderr.write("Docker is required for @knowledgeos/master-storage test:postgres. Start Docker and retry.\n");
  process.exitCode = 1;
} else {
  try {
    requireSuccess(
      run(docker, [
        "run", "--rm", "-d", "--name", name,
        "-e", `POSTGRES_DB=${database}`,
        "-e", `POSTGRES_USER=${user}`,
        "-e", `POSTGRES_PASSWORD=${password}`,
        "-p", "127.0.0.1::5432",
        "postgres:17-alpine",
      ]),
      "Could not start the ephemeral PostgreSQL container.",
    );
    await waitForPostgres();
    const port = run(docker, ["port", name, "5432/tcp"]);
    requireSuccess(port, "Could not resolve the ephemeral PostgreSQL port.");
    const publishedPort = port.stdout.trim().match(/:(\d+)$/)?.[1];
    if (!publishedPort) throw new Error("Docker did not publish a PostgreSQL TCP port.");
    await waitForPublishedPort(publishedPort);
    const result = run(
      process.execPath,
      ["--test", "dist-test/test/postgres-container.integration.test.js"],
      {
        env: {
          ...process.env,
          MASTER_STORAGE_TEST_DATABASE_URL: `postgresql://${user}:${password}@127.0.0.1:${publishedPort}/${database}`,
        },
      },
    );
    process.stdout.write(result.stdout);
    requireSuccess(result, "Containerized PostgreSQL integration assertions failed.");
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  } finally {
    run(docker, ["rm", "-f", name]);
  }
}
