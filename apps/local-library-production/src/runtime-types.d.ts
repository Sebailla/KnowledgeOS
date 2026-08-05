declare module "node:fs/promises" {
  export function mkdir(
    path: string,
    options?: { recursive?: boolean },
  ): Promise<void>;
  export function statfs(path: string): Promise<{
    readonly bavail: number | bigint;
    readonly bsize: number | bigint;
  }>;
}

declare module "node:path" {
  export function join(...parts: readonly string[]): string;
}
declare const process: { env: Readonly<Record<string, string | undefined>>; once(signal: string, listener: () => void): void; exit(code?: number): never; };
declare function setInterval(listener: () => void, milliseconds: number): unknown;
