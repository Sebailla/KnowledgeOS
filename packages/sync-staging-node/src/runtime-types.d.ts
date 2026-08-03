declare class Buffer extends Uint8Array {
  static from(value: string | Uint8Array): Buffer;
  readonly byteLength: number;
}

declare module "node:fs/promises" {
  export interface FileHandle {
    write(
      buffer: Uint8Array,
      offset?: number,
      length?: number,
      position?: number,
    ): Promise<{ bytesWritten: number }>;
    sync(): Promise<void>;
    close(): Promise<void>;
  }

  export function mkdir(
    path: string,
    options?: { recursive?: boolean },
  ): Promise<void>;
  export function open(
    path: string,
    flags: string,
  ): Promise<FileHandle>;
  export function readFile(path: string): Promise<Buffer>;
  export function stat(path: string): Promise<{ size: number }>;
  export function rm(
    path: string,
    options?: { force?: boolean; recursive?: boolean },
  ): Promise<void>;
  export function access(path: string): Promise<void>;
  export function readdir(
    path: string,
    options?: { withFileTypes?: boolean },
  ): Promise<readonly {
    readonly name: string;
    isFile(): boolean;
    isDirectory(): boolean;
  }[]>;
}

declare module "node:path" {
  export function join(...parts: readonly string[]): string;
}
