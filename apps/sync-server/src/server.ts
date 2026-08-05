import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { OperationEnvelope } from "@knowledgeos/sync";
import { protocolOperationStore } from "./protocolStore.js";

export interface SyncServerOptions {
  readonly host: string;
  readonly port: number;
  readonly token?: string;
}

export class SyncHTTPServer {
  private server: Server | undefined;
  private sequence = 0;
  private readonly operations:
    unknown[] = [];
  private readonly idempotency =
    new Map<string, unknown>();

  public constructor(
    private readonly options:
      SyncServerOptions,
  ) {}

  public async start():
  Promise<{ host: string; port: number }> {
    const server = createServer(
      (request, response) =>
        void this.handle(
          request,
          response,
        ),
    );

    this.server = server;

    await new Promise<void>(
      (resolve) =>
        server.listen(
          this.options.port,
          this.options.host,
          resolve,
        ),
    );

    const address = server.address();

    if (
      !address ||
      typeof address === "string"
    ) {
      throw new Error(
        "Unable to resolve address.",
      );
    }

    return {
      host: address.address,
      port: address.port,
    };
  }

  public async stop(): Promise<void> {
    const server = this.server;
    if (!server) return;

    await new Promise<void>(
      (resolve, reject) =>
        server.close((error) =>
          error
            ? reject(error)
            : resolve(),
        ),
    );

    this.server = undefined;
  }

  private async handle(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    const method =
      request.method ?? "GET";
    const url =
      request.url ?? "/";

    if (
      method === "GET" &&
      url === "/v1/sync/health"
    ) {
      json(response, 200, {
        status: "ok",
        protocolVersion: "1.0",
        serverVersion: "1.0.0",
        authenticated:
          this.authorized(request),
      });
      return;
    }

    if (!this.authorized(request)) {
      json(response, 401, {
        error: {
          code: "UNAUTHORIZED",
          message:
            "Bearer token is invalid.",
        },
      });
      return;
    }

    if (
      method === "POST" &&
      url === "/v1/sync/push"
    ) {
      const key =
        header(
          request,
          "idempotency-key",
        );

      if (!key) {
        json(response, 400, {
          error: {
            code:
              "IDEMPOTENCY_KEY_REQUIRED",
            message:
              "idempotency-key is required.",
          },
        });
        return;
      }

      const cached =
        this.idempotency.get(key);

      if (cached !== undefined) {
        json(response, 200, cached);
        return;
      }

      const body = await readJSON(request);
      const operations =
        Array.isArray(body.operations)
          ? body.operations
          : [];

      this.operations.push(...operations);
      this.sequence += operations.length;

      const result = {
        accepted: operations.length,
        cursor: String(this.sequence),
      };

      this.idempotency.set(key, result);
      json(response, 200, result);
      return;
    }

    if (
      method === "POST" &&
      url === "/v1/sync/pull"
    ) {
      const body = await readJSON(request);
      const cursor =
        Number(body.cursor ?? 0);
      const limit = Math.max(
        1,
        Math.min(
          100,
          Number(body.limit ?? 50),
        ),
      );

      const operations =
        this.operations.slice(
          cursor,
          cursor + limit,
        );

      const next =
        cursor + operations.length;

      json(response, 200, {
        operations,
        cursor: String(next),
        hasMore:
          next < this.operations.length,
      });
      return;
    }


    if (method === "POST" && url === "/v1/usp/envelopes") {
      const body = await readJSON(request);
      try {
        const acknowledgement = protocolOperationStore.accept(body as unknown as OperationEnvelope);
        json(response, 200, acknowledgement);
      } catch (error) {
        json(response, 400, {
          error: {
            code: error instanceof Error ? error.message : "USP_INVALID",
            message: "Universal Synchronization Protocol envelope is invalid.",
          },
        });
      }
      return;
    }

    if (method === "POST" && url === "/v1/usp/pull") {
      const body = await readJSON(request);
      const serverSequence = Number(body.serverSequence ?? 0);
      const limit = Number(body.limit ?? 100);
      json(response, 200, {
        operations: protocolOperationStore.pull(serverSequence, limit),
        cursor: { serverSequence: serverSequence + protocolOperationStore.pull(serverSequence, limit).length, localSequence: 0 },
      });
      return;
    }

    if (method === "GET" && url === "/v1/usp/checkpoint") {
      json(response, 200, protocolOperationStore.checkpoint("checkpoint:latest"));
      return;
    }

    json(response, 404, {
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found.",
      },
    });
  }

  private authorized(
    request: IncomingMessage,
  ): boolean {
    if (!this.options.token) {
      return true;
    }

    return (
      header(
        request,
        "authorization",
      ) ===
      `Bearer ${this.options.token}`
    );
  }
}

function header(
  request: IncomingMessage,
  name: string,
): string | undefined {
  const value =
    request.headers[
      name.toLowerCase()
    ];

  return typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value[0]
      : undefined;
}

async function readJSON(
  request: IncomingMessage,
): Promise<Record<string, unknown>> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of request) {
    chunks.push(
      typeof chunk === "string"
        ? new TextEncoder().encode(chunk)
        : chunk,
    );
  }

  const size = chunks.reduce(
    (sum, chunk) =>
      sum + chunk.length,
    0,
  );

  if (size === 0) return {};

  const bytes = new Uint8Array(size);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }

  const value = JSON.parse(
    new TextDecoder().decode(bytes),
  );

  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
    ? value as Record<string, unknown>
    : {};
}

function json(
  response: ServerResponse,
  status: number,
  body: unknown,
): void {
  response.statusCode = status;
  response.setHeader(
    "content-type",
    "application/json; charset=utf-8",
  );
  response.end(JSON.stringify(body));
}
