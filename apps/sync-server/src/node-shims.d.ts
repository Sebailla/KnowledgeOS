declare namespace NodeJS {
  interface ReadableStream
  extends AsyncIterable<
    Uint8Array | string
  > {}
}

declare module "node:http" {
  export interface IncomingMessage
  extends NodeJS.ReadableStream {
    readonly method?: string;
    readonly url?: string;
    readonly headers:
      Record<
        string,
        string | string[] | undefined
      >;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(
      name: string,
      value: string,
    ): void;
    end(value?: string): void;
  }

  export interface Server {
    listen(
      port: number,
      host: string,
      callback: () => void,
    ): void;
    close(
      callback:
        (error?: Error) => void,
    ): void;
    address():
      | string
      | {
          address: string;
          port: number;
        }
      | null;
  }

  export function createServer(
    listener: (
      request: IncomingMessage,
      response: ServerResponse,
    ) => void,
  ): Server;
}


declare class TextEncoder {
  encode(value: string): Uint8Array;
}

declare class TextDecoder {
  decode(value: Uint8Array): string;
}

declare interface Response {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
}

declare function fetch(
  input: string,
  init?: {
    readonly method?: string;
    readonly headers?: Readonly<Record<string, string>>;
    readonly body?: string;
  },
): Promise<Response>;
declare module "node:fs/promises" { export function readFile(path: string, encoding: "utf8"): Promise<string>; }
declare const process: { env: Record<string, string | undefined>; once(signal: string, listener: () => void): void; exit(code?: number): never; };
