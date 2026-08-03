import { join } from "node:path";
import type { ContentFingerprint } from "@knowledgeos/domain-types";

export interface StoragePaths {
  readonly root: string;
  readonly objects: string;
  readonly staging: string;
  readonly quarantine: string;
}

export function createStoragePaths(root: string): StoragePaths {
  return {
    root,
    objects: join(root, "objects"),
    staging: join(root, "staging"),
    quarantine: join(root, "quarantine"),
  };
}

export function objectRelativePath(
  fingerprint: ContentFingerprint,
): string {
  const normalized = String(fingerprint).replace(/^sha256:/, "").toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalized)) {
    throw new Error("SHA-256 fingerprint must contain 64 hexadecimal characters");
  }
  return join(
    "objects",
    normalized.slice(0, 2),
    normalized.slice(2, 4),
    normalized,
  );
}
