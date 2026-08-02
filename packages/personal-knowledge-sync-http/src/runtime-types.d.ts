interface RequestInit {
  readonly method?: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: string;
}

interface Response {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
}

declare function fetch(
  input: string,
  init?: RequestInit,
): Promise<Response>;
