declare module "node:fs" {
  export interface ReadStream extends AsyncIterable<Uint8Array> {
    destroy(error?: Error): void;
  }

  export interface CreateReadStreamOptions {
    readonly start?: number;
    readonly end?: number;
  }

  export function createReadStream(
    path: string,
    options?: CreateReadStreamOptions,
  ): ReadStream;
}

declare module "node:fs/promises" {
  export function stat(path: string): Promise<{
    readonly size: number;
    isFile(): boolean;
  }>;
}

declare module "node:path" {
  export function join(...parts: readonly string[]): string;
}
