declare class Buffer extends Uint8Array {
  static concat(
    values: readonly Uint8Array[],
  ): Buffer;
  toString(encoding?: string): string;
}

declare module "node:http" {
  export interface IncomingMessage {
    readonly method?: string;
    readonly url?: string;
    readonly headers: Readonly<Record<string, string | string[] | undefined>>;
    [Symbol.asyncIterator](): AsyncIterator<Uint8Array>;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string | number): void;
    end(data?: string | Uint8Array): void;
  }

  export interface Server {
    listen(
      port: number,
      host: string,
      callback: () => void,
    ): void;
    close(
      callback: (error?: Error) => void,
    ): void;
    address(): {
      readonly port: number;
      readonly address: string;
    } | string | null;
  }

  export function createServer(
    handler: (
      request: IncomingMessage,
      response: ServerResponse,
    ) => void | Promise<void>,
  ): Server;
}

declare class URLSearchParams {
  get(name: string): string | null;
}

declare class URL {
  constructor(input: string, base?: string);
  readonly pathname: string;
  readonly searchParams: URLSearchParams;
}
