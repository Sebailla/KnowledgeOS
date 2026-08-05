declare class URL {
  public constructor(
    input: string,
    base?: string,
  );
}

declare class AbortSignal {}

declare class AbortController {
  public readonly signal: AbortSignal;
  public abort(): void;
}

declare class DOMException extends Error {
  public readonly name: string;
}

declare class Response {
  public constructor(
    body?: string,
    init?: {
      readonly status?: number;
      readonly headers?:
        Readonly<Record<string, string>>;
    },
  );
  public readonly ok: boolean;
  public readonly status: number;
  public json(): Promise<unknown>;
}

declare type RequestInit = {
  readonly method?: string;
  readonly headers?:
    Readonly<Record<string, string>>;
  readonly body?: string;
  readonly signal?: AbortSignal;
};

declare function fetch(
  input: URL | string,
  init?: RequestInit,
): Promise<Response>;

declare function setTimeout(
  handler: () => void,
  milliseconds: number,
): unknown;

declare function clearTimeout(
  handle: unknown,
): void;
