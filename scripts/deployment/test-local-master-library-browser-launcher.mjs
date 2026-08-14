import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const workspace = mkdtempSync(join(tmpdir(), "knowledgeos-local-browser-launcher-"));
const fixture = join(workspace, "fixture");
mkdirSync(fixture);
const run = (source) => spawnSync("node", ["scripts/deployment/start-local-master-library-browser.mjs"], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, MASTER_LIBRARY_FIXTURE_ROOT: fixture, MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE: source },
});
const reject = (source, expected) => {
  const result = run(source);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, expected);
};

try {
  reject("relative-password.txt", /must be an absolute path/i);
  const empty = join(workspace, "empty-password.txt");
  writeFileSync(empty, "\n", { mode: 0o600 });
  reject(empty, /must not be empty/i);
  const insecure = join(workspace, "insecure-password.txt");
  writeFileSync(insecure, "password\n", { mode: 0o600 });
  chmodSync(insecure, 0o644);
  reject(insecure, /must have mode 0600/i);
  const directory = join(workspace, "password-directory");
  mkdirSync(directory, { mode: 0o700 });
  reject(directory, /must be a regular file/i);
  reject(join(root, "package.json"), /must not be inside the repository/i);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
