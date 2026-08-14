import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const fixture = mkdtempSync(join(tmpdir(), "knowledgeos-pr5-test-"));

try {
  const output = execFileSync("bash", ["scripts/deployment/validate-production.sh", "--fixture-root", fixture, "--plan"], {
    cwd: root,
    encoding: "utf8",
  });
  const plan = JSON.parse(output);
  assert.equal(plan.fixtureRoot, fixture);
  assert.deepEqual(plan.requiredDirectories, ["postgres", "publications", "operations", "backups"]);
  assert.equal(plan.mode, "local-docker-desktop");
  assert.equal(plan.nasReleaseReady, false);
  assert.match(plan.releaseGate, /G0\/G1\/G2/);
  assert.match(execFileSync("bash", ["scripts/deployment/validate-production.sh", "--fixture-root", fixture, "--plan"], { cwd: root, encoding: "utf8" }), /local-docker-desktop/);

  mkdirSync(join(fixture, "publications"), { recursive: true });
  mkdirSync(join(fixture, "operations"), { recursive: true });
  writeFileSync(join(fixture, "publications", "publication.txt"), "authoritative fixture");
  writeFileSync(join(fixture, "operations", "journal.json"), '{"operation":"fixture"}');
  const backup = execFileSync("bash", ["scripts/deployment/backup-production.sh", "--fixture-root", fixture], { cwd: root, encoding: "utf8" }).trim();
  const manifest = JSON.parse(readFileSync(join(backup, "manifest.json"), "utf8"));
  assert.equal(manifest.complete, true);
  assert.deepEqual(manifest.components, ["operations", "postgres", "publications"]);
  writeFileSync(join(fixture, "publications", "publication.txt"), "mutated");
  execFileSync("bash", ["scripts/deployment/restore-production.sh", "--fixture-root", fixture, "--backup", backup], { cwd: root, encoding: "utf8" });
  assert.equal(readFileSync(join(fixture, "publications", "publication.txt"), "utf8"), "authoritative fixture");
  writeFileSync(join(backup, "manifest.json"), '{"complete":false}');
  assert.throws(() => execFileSync("bash", ["scripts/deployment/restore-production.sh", "--fixture-root", fixture, "--backup", backup], { cwd: root, encoding: "utf8", stdio: "pipe" }), /partial/);
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
