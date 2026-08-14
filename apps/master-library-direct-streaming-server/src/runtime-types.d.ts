declare module "node:http" {
  export interface IncomingHttpHeaders {
    readonly [key: string]: string | readonly string[] | undefined;
  }

  export interface IncomingMessage {
    readonly method?: string;
    readonly url?: string;
    readonly headers: IncomingHttpHeaders;
    readonly socket: { readonly remoteAddress?: string };
    readonly complete: boolean;
    once(event: "aborted" | "close", listener: () => void): void;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string | number): void;
    write(chunk: Uint8Array): boolean;
    once(event: "drain" | "close", listener: () => void): void;
    end(data?: string | Uint8Array): void;
  }

  export interface AddressInfo {
    readonly address: string;
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

declare const Buffer: {
  from(value: string | Uint8Array<ArrayBufferLike>, encoding?: string): Buffer;
  alloc(size: number): Buffer;
  concat(values: readonly Uint8Array<ArrayBufferLike>[]): Buffer;
};

interface Buffer extends Uint8Array<ArrayBufferLike> {
  indexOf(searchElement: number, fromIndex?: number): number;
  indexOf(
    value: string | Uint8Array<ArrayBufferLike>,
    byteOffset?: number,
    encoding?: string,
  ): number;
  subarray(begin?: number, end?: number): Buffer;
  toString(encoding?: string): string;
}

declare class URL {
  public constructor(input: string, base?: string | URL);
  public readonly host: string;
  public readonly protocol: string;
}

declare const process: {
  readonly env: Readonly<Record<string, string | undefined>>;
};
