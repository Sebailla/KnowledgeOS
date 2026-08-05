export interface MasterLibraryConnectionConfiguration {
  readonly baseURL: string;
  readonly token?: string;
  readonly timeoutMilliseconds?: number;
  readonly maxAttempts?: number;
}

export interface MasterLibraryTransportHealth {
  readonly status: "ok";
  readonly protocolVersion: string;
  readonly serverVersion: string;
  readonly latencyMilliseconds: number;
  readonly authenticated: boolean;
}

export class MasterLibraryTransportError extends Error {
  public constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "MasterLibraryTransportError";
  }
}

export class MasterLibraryTransport {
  public constructor(
    private readonly configuration:
      MasterLibraryConnectionConfiguration,
    private readonly fetcher:
      typeof fetch = fetch,
  ) {}

  public async health():
  Promise<MasterLibraryTransportHealth> {
    const startedAt = Date.now();
    const response = await this.request(
      "GET",
      "/v1/sync/health",
    );
    const value = await response.json() as
      Record<string, unknown>;

    return {
      status: "ok",
      protocolVersion:
        stringField(value, "protocolVersion"),
      serverVersion:
        stringField(value, "serverVersion"),
      latencyMilliseconds:
        Date.now() - startedAt,
      authenticated:
        booleanField(value, "authenticated"),
    };
  }

  public async push(
    operations: readonly unknown[],
    idempotencyKey: string,
  ): Promise<{
    readonly accepted: number;
    readonly cursor: string;
  }> {
    const response = await this.request(
      "POST",
      "/v1/sync/push",
      { operations },
      {
        "idempotency-key":
          idempotencyKey,
      },
    );

    const value = await response.json() as
      Record<string, unknown>;

    return {
      accepted:
        numberField(value, "accepted"),
      cursor:
        stringField(value, "cursor"),
    };
  }

  public async pull(
    cursor = "0",
    limit = 50,
  ): Promise<{
    readonly operations:
      readonly unknown[];
    readonly cursor: string;
    readonly hasMore: boolean;
  }> {
    const response = await this.request(
      "POST",
      "/v1/sync/pull",
      { cursor, limit },
    );

    const value = await response.json() as
      Record<string, unknown>;

    const operations = value.operations;

    if (!Array.isArray(operations)) {
      throw new MasterLibraryTransportError(
        "Invalid operations response.",
        "INVALID_RESPONSE",
      );
    }

    return {
      operations,
      cursor:
        stringField(value, "cursor"),
      hasMore:
        booleanField(value, "hasMore"),
    };
  }

  private async request(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders:
      Readonly<Record<string, string>> = {},
  ): Promise<Response> {
    const attempts = Math.max(
      1,
      this.configuration.maxAttempts ?? 3,
    );

    let lastError: unknown;

    for (
      let attempt = 1;
      attempt <= attempts;
      attempt += 1
    ) {
      const controller =
        new AbortController();

      const timeout = setTimeout(
        () => controller.abort(),
        this.configuration
          .timeoutMilliseconds ?? 10_000,
      );

      try {
        const response =
          await this.fetcher(
            new URL(
              path,
              this.configuration.baseURL.endsWith("/")
                ? this.configuration.baseURL
                : `${this.configuration.baseURL}/`,
            ),
            {
              method,
              headers: {
                accept: "application/json",
                ...(body !== undefined
                  ? {
                      "content-type":
                        "application/json",
                    }
                  : {}),
                ...(this.configuration.token
                  ? {
                      authorization:
                        `Bearer ${this.configuration.token}`,
                    }
                  : {}),
                ...extraHeaders,
              },
              ...(body !== undefined
                ? {
                    body:
                      JSON.stringify(body),
                  }
                : {}),
              signal: controller.signal,
            },
          );

        if (response.ok) {
          return response;
        }

        const status = response.status;
        const payload =
          await response.json()
            .catch(() => ({})) as
            Record<string, unknown>;

        const error =
          payload.error as
            Record<string, unknown> | undefined;

        throw new MasterLibraryTransportError(
          typeof error?.message === "string"
            ? error.message
            : `HTTP ${status}`,
          typeof error?.code === "string"
            ? error.code
            : "HTTP_ERROR",
          status,
        );
      } catch (error) {
        lastError = error;

        if (
          attempt === attempts ||
          (
            error instanceof
              MasterLibraryTransportError &&
            error.status !== undefined &&
            error.status < 500
          )
        ) {
          throw normalize(error);
        }
      } finally {
        clearTimeout(timeout);
      }

      await new Promise<void>(
        (resolve) =>
          setTimeout(
            resolve,
            Math.min(
              2_000,
              100 * 2 ** (attempt - 1),
            ),
          ),
      );
    }

    throw normalize(lastError);
  }
}

function normalize(
  error: unknown,
): MasterLibraryTransportError {
  if (
    error instanceof
      MasterLibraryTransportError
  ) {
    return error;
  }

  return new MasterLibraryTransportError(
    error instanceof Error
      ? error.message
      : String(error),
    error instanceof DOMException &&
      error.name === "AbortError"
      ? "TIMEOUT"
      : "NETWORK_ERROR",
  );
}

function stringField(
  value: Record<string, unknown>,
  key: string,
): string {
  const field = value[key];

  if (typeof field !== "string") {
    throw new MasterLibraryTransportError(
      `Invalid '${key}'.`,
      "INVALID_RESPONSE",
    );
  }

  return field;
}

function numberField(
  value: Record<string, unknown>,
  key: string,
): number {
  const field = value[key];

  if (typeof field !== "number") {
    throw new MasterLibraryTransportError(
      `Invalid '${key}'.`,
      "INVALID_RESPONSE",
    );
  }

  return field;
}

function booleanField(
  value: Record<string, unknown>,
  key: string,
): boolean {
  const field = value[key];

  if (typeof field !== "boolean") {
    throw new MasterLibraryTransportError(
      `Invalid '${key}'.`,
      "INVALID_RESPONSE",
    );
  }

  return field;
}
