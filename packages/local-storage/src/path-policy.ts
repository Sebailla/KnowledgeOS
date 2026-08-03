import { join } from "node:path";

export interface LocalStoragePaths {
  readonly root: string;
  readonly objects: string;
  readonly staging: string;
  readonly quarantine: string;
}

export function createLocalStoragePaths(
  root: string,
): LocalStoragePaths {
  return {
    root,
    objects: join(root, "objects"),
    staging: join(root, "staging"),
    quarantine: join(root, "quarantine"),
  };
}

export function objectRelativePath(
  fingerprint: string,
): string {
  const value =
    fingerprint.replace(/^sha256:/, "");
  if (!/^[a-f0-9]{64}$/.test(value)) {
    throw new Error("Invalid SHA-256 fingerprint");
  }
  return join(
    "objects",
    value.slice(0, 2),
    value.slice(2, 4),
    value,
  );
}
