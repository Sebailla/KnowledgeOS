import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open, readFile, rm } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import type { ProcessingLease, StagedImportRequestV2 } from "@knowledgeos/contracts";

export class StagedSourceError extends Error {}

type HeldLease = { readonly lease: ProcessingLease; readonly handle: FileHandle; readonly entry: string };
type FileHandle = { readonly fd: number; readFile(): Promise<Uint8Array>; close(): Promise<void> };
type AfterSourceValidation = (source: string) => Promise<void>;

export class StagedSourceResolver {
  private readonly leases = new Map<string, HeldLease>();
  private readonly root: string;

  public constructor(
    root: string,
    private readonly now: () => Date = () => new Date(),
    private readonly afterSourceValidation?: AfterSourceValidation,
  ) {
    this.root = resolve(root);
  }

  public async accept(request: StagedImportRequestV2): Promise<ProcessingLease> {
    const entry = this.entryFor(request.source.capability);
    await this.validateMetadata(entry);
    const source = join(entry, "source");
    const before = await lstat(source).catch(() => { throw new StagedSourceError("Staged source is unavailable."); });
    if (!before.isFile() || before.isSymbolicLink()) throw new StagedSourceError("Staged source is not a regular file.");
    await this.afterSourceValidation?.(source);
    const handle = await open(source, constants.O_RDONLY | constants.O_NOFOLLOW).catch(() => { throw new StagedSourceError("Staged source cannot be opened safely."); });
    try {
      const after = await handle.stat();
      const bytes = await handle.readFile();
      if (!after.isFile() || bytes.byteLength !== request.byteLength || digest(bytes) !== request.sha256) throw new StagedSourceError("Staged source integrity check failed.");
      const lease: ProcessingLease = { leaseId: randomUUID(), capability: request.source.capability, descriptor: handle.fd, owner: "core-host" };
      this.leases.set(lease.leaseId, { lease, handle, entry });
      return lease;
    } catch (error) {
      await handle.close();
      throw error;
    }
  }

  public async release(leaseId: string): Promise<void> {
    const held = this.leases.get(leaseId);
    if (!held) return;
    this.leases.delete(leaseId);
    await held.handle.close();
    await rm(held.entry, { recursive: true, force: true });
  }

  public leaseCount(): number { return this.leases.size; }

  private entryFor(capability: string): string {
    if (!/^[A-Za-z0-9_-]{8,}$/.test(capability)) throw new StagedSourceError("Invalid staged capability.");
    const entry = resolve(this.root, capability);
    if (!entry.startsWith(`${this.root}${sep}`)) throw new StagedSourceError("Staged source escapes its root.");
    return entry;
  }

  private async validateMetadata(entry: string): Promise<void> {
    const path = join(entry, "metadata.json");
    let metadata: unknown;
    try { metadata = JSON.parse(await readFile(path, "utf8")); } catch (error) {
      if ((error as { code?: string }).code === "ENOENT") return;
      throw new StagedSourceError("Staged source metadata is malformed.");
    }
    const expiresAt = typeof metadata === "object" && metadata !== null ? (metadata as Record<string, unknown>).expiresAt : undefined;
    if (typeof expiresAt !== "string" || Number.isNaN(Date.parse(expiresAt)) || Date.parse(expiresAt) <= this.now().getTime()) throw new StagedSourceError("Staged source has expired.");
  }
}

function digest(bytes: Uint8Array): string { return createHash("sha256").update(bytes).digest("hex"); }
