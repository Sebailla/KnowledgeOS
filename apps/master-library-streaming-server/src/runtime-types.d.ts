declare class Buffer extends Uint8Array {
  static from(value: string | Uint8Array, encoding?: string): Buffer;
  static concat(chunks: readonly Uint8Array[]): Buffer;
  readonly byteLength: number;
  toString(encoding?: string): string;
  subarray(start?: number, end?: number): Buffer;
}

declare module "node:http" {
  export interface IncomingHttpHeaders {
    readonly [key: string]: string | readonly string[] | undefined;
  }

  export interface IncomingMessage extends AsyncIterable<Uint8Array> {
    readonly method?: string;
    readonly url?: string;
    readonly headers: IncomingHttpHeaders;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string | number): void;
    write(chunk: Uint8Array): boolean;
    once(event: "drain", listener: () => void): void;
    end(data?: string | Uint8Array): void;
  }

  export interface AddressInfo {
    readonly address: string;
    readonly family: string;
    readonly port: number;
  }

  export interface Server {
    listen(port: number, host: string, callback?: () => void): this;
    close(callback?: (error?: Error) => void): this;
    address(): AddressInfo | string | null;
  }

  export function createServer(
    handler: (
      request: IncomingMessage,
      response: ServerResponse,
    ) => void | Promise<void>,
  ): Server;
}

declare const process: {
  readonly env: Readonly<Record<string, string | undefined>>;
  on(event: "SIGINT" | "SIGTERM", listener: () => void): void;
};

declare const console: {
  log(...values: readonly unknown[]): void;
  error(...values: readonly unknown[]): void;
};
