declare module "node:child_process" {
  interface ChildProcess {
    readonly stdout: { on(event: "data", listener: (chunk: Uint8Array) => void): void } | null;
    readonly stderr: { on(event: "data", listener: (chunk: Uint8Array) => void): void } | null;
    on(event: "error", listener: (error: Error) => void): void;
    on(event: "close", listener: (code: number | null) => void): void;
    kill(signal?: "SIGKILL"): boolean;
  }
  export function spawn(executable: string, args: readonly string[], options: { readonly shell: false; readonly stdio: readonly ["pipe", "pipe", "pipe"] }): ChildProcess & { readonly stdin: { end(data: Uint8Array): void } | null };
}

declare module "node:fs/promises" {
  export function mkdir(path: string, options: { readonly recursive: true }): Promise<void>;
  export function mkdtemp(prefix: string): Promise<string>;
  export function rm(path: string, options: { readonly recursive: true; readonly force: true }): Promise<void>;
  export function readFile(path: string): Promise<Uint8Array>;
  export function writeFile(path: string, data: Uint8Array): Promise<void>;
}

declare module "node:path" {
  export function join(...parts: readonly string[]): string;
}

interface AbortSignal {
  readonly aborted: boolean;
  addEventListener?(type: "abort", listener: () => void, options?: { readonly once?: boolean }): void;
  removeEventListener?(type: "abort", listener: () => void): void;
}

declare class TextDecoder {
  decode(input?: Uint8Array): string;
}

declare function setTimeout(callback: () => void, delay: number): unknown;
declare function clearTimeout(timeout: unknown): void;
