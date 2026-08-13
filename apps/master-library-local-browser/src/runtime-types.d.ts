declare module "node:http" {
  export interface IncomingMessage { readonly method?: string; readonly url?: string; readonly headers: Record<string, string | string[] | undefined>; on(event: "data", listener: (chunk: Uint8Array | string) => void): void; once(event: "end" | "error", listener: (error?: Error) => void): void; }
  export interface ServerResponse { statusCode: number; setHeader(name: string, value: string | number): void; end(data?: string | Uint8Array): void; }
  export interface Server { listen(port: number, host: string, callback?: () => void): this; close(callback: (error?: Error) => void): void; address(): { address: string; port: number } | string | null; }
  export function createServer(handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>): Server;
}
declare const Buffer: { from(value: string): Uint8Array; concat(values: Uint8Array[]): { toString(encoding: string): string; }; };
declare class URL { constructor(input: string, base?: string | URL); }
interface ImportMeta { readonly url: string; }
declare module "node:fs/promises" { export function readFile(path: URL): Promise<Uint8Array>; }
