interface AbortSignal {
  readonly aborted: boolean;
}

interface RequestInit {
  readonly method?: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly signal?: AbortSignal;
}

interface Response {
  readonly ok: boolean;
  readonly status: number;
  readonly headers: {
    get(name: string): string | null;
  };
  arrayBuffer(): Promise<ArrayBuffer>;
}

declare function fetch(
  input: string,
  init?: RequestInit,
): Promise<Response>;

declare class Buffer extends Uint8Array {
  static from(
    value: ArrayBuffer | Uint8Array | string,
    encoding?: string,
  ): Buffer;
  readonly byteLength: number;
}
