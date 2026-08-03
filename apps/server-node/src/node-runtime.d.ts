declare const console: {
  log(...values: readonly unknown[]): void;
  error(...values: readonly unknown[]): void;
};

declare class Buffer extends Uint8Array {
  static concat(chunks: readonly Uint8Array[]): Buffer;
  static from(value: string): Buffer;
  toString(encoding?: string): string;
}

declare const process: {
  readonly env: Readonly<Record<string, string | undefined>>;
  exitCode?: number;
  on(event: "SIGINT" | "SIGTERM", listener: () => void): void;
};

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
    end(data?: string | Uint8Array): void;
  }

  export interface AddressInfo {
    readonly address: string;
    readonly family: string;
    readonly port: number;
  }

  export interface Server {
    listen(
      port: number,
      host: string,
      callback?: () => void,
    ): this;
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
