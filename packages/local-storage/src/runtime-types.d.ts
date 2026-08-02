declare class Buffer extends Uint8Array {
  static from(value: string | Uint8Array, encoding?: string): Buffer;
  toString(encoding?: string): string;
}

declare module "node:crypto" {
  export interface Hash {
    update(data: Uint8Array | string): Hash;
    digest(encoding: "hex"): string;
  }
  export function createHash(algorithm: string): Hash;
  export function randomUUID(): string;
}

declare module "node:fs/promises" {
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function writeFile(path: string, data: Uint8Array): Promise<void>;
  export function readFile(path: string): Promise<Buffer>;
  export function rename(oldPath: string, newPath: string): Promise<void>;
  export function rm(path: string, options?: { force?: boolean; recursive?: boolean }): Promise<void>;
  export function stat(path: string): Promise<{ size: number; isFile(): boolean }>;
  export function readdir(
    path: string,
    options?: { withFileTypes?: boolean },
  ): Promise<readonly { name: string; isFile(): boolean; isDirectory(): boolean }[]>;
  export function access(path: string): Promise<void>;
}

declare module "node:path" {
  export function join(...parts: readonly string[]): string;
  export function dirname(path: string): string;
}
