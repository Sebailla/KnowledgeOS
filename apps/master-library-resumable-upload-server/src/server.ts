import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type {
  UploadSessionMetadata,
  ResumableUploadService,
} from "@knowledgeos/master-resumable-upload";
import {
  collectBody,
} from "@knowledgeos/master-library-streaming-server";

export interface ResumableUploadServerOptions {
  readonly host: string;
  readonly port: number;
  readonly maximumChunkBytes: number;
}

export interface ResumableUploadServerDependencies {
  readonly service: ResumableUploadService;
}

export interface BoundAddress {
  readonly host: string;
  readonly port: number;
}

function headerValue(
  request: IncomingMessage,
  name: string,
): string | undefined {
  const value =
    request.headers[name.toLowerCase()];
  return typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value.join(",")
      : undefined;
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

function parseSessionMetadata(
  body: unknown,
): UploadSessionMetadata {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    throw new Error(
      "Session metadata must be an object",
    );
  }

  const value =
    body as Record<string, unknown>;

  const string = (name: string): string => {
    const field = value[name];
    if (
      typeof field !== "string" ||
      !field.trim()
    ) {
      throw new Error(`${name} is required`);
    }
    return field;
  };

  const number = (name: string): number => {
    const field = value[name];
    if (
      typeof field !== "number" ||
      !Number.isInteger(field)
    ) {
      throw new Error(
        `${name} must be an integer`,
      );
    }
    return field;
  };

  const authors =
    Array.isArray(value.authors) &&
    value.authors.every(
      (item) => typeof item === "string",
    )
      ? value.authors as string[]
      : [];

  return {
    publicationId:
      string("publicationId") as never,
    knowledgeObjectId:
      string("knowledgeObjectId") as never,
    sourceItemId:
      string("sourceItemId") as never,
    versionId:
      string("versionId") as never,
    title: string("title"),
    authors,
    mediaType: string("mediaType"),
    expectedByteLength:
      number("expectedByteLength"),
    expectedChunkCount:
      number("expectedChunkCount"),
  };
}

export class ResumableUploadHttpServer {
  private server: Server | undefined;

  public constructor(
    private readonly dependencies:
      ResumableUploadServerDependencies,
    private readonly options:
      ResumableUploadServerOptions,
  ) {}

  async start(): Promise<BoundAddress> {
    if (this.server) {
      throw new Error("Server already started");
    }

    const server = createServer(
      async (request, response) => {
        await this.handle(
          request,
          response,
        );
      },
    );
    this.server = server;

    await new Promise<void>((resolve) => {
      server.listen(
        this.options.port,
        this.options.host,
        resolve,
      );
    });

    const address = server.address();
    if (
      !address ||
      typeof address === "string"
    ) {
      throw new Error(
        "Unable to resolve address",
      );
    }

    return {
      host: address.address,
      port: address.port,
    };
  }

  async stop(): Promise<void> {
    const server = this.server;
    if (!server) return;

    await new Promise<void>(
      (resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      },
    );
    this.server = undefined;
  }

  private async handle(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const method =
        request.method ?? "GET";
      const target =
        request.url ?? "/";

      if (
        method === "POST" &&
        target === "/v1/master-library/upload-sessions"
      ) {
        const bytes = await collectBody(
          request,
          1024 * 1024,
        );
        const metadata =
          parseSessionMetadata(
            JSON.parse(
              bytes.toString("utf8"),
            ),
          );
        const session =
          await this.dependencies.service.createSession(
            metadata,
          );
        json(response, 201, session);
        return;
      }

      const chunkMatch =
        /^\/v1\/master-library\/upload-sessions\/([^/]+)\/chunks\/(\d+)$/.exec(
          target,
        );
      if (
        method === "PUT" &&
        chunkMatch
      ) {
        const sessionId =
          decodeURIComponent(
            chunkMatch[1] ?? "",
          );
        const index = Number(
          chunkMatch[2] ?? "-1",
        );
        const checksum =
          headerValue(
            request,
            "x-chunk-sha256",
          );
        if (!checksum) {
          throw new Error(
            "x-chunk-sha256 is required",
          );
        }

        const bytes = await collectBody(
          request,
          this.options.maximumChunkBytes,
        );
        const progress =
          await this.dependencies.service.putChunk(
            sessionId,
            index,
            bytes,
            checksum,
          );
        json(response, 200, progress);
        return;
      }

      const sessionMatch =
        /^\/v1\/master-library\/upload-sessions\/([^/]+)$/.exec(
          target,
        );
      if (
        method === "GET" &&
        sessionMatch
      ) {
        const progress =
          await this.dependencies.service.getProgress(
            decodeURIComponent(
              sessionMatch[1] ?? "",
            ),
          );
        json(response, 200, progress);
        return;
      }

      const completeMatch =
        /^\/v1\/master-library\/upload-sessions\/([^/]+)\/complete$/.exec(
          target,
        );
      if (
        method === "POST" &&
        completeMatch
      ) {
        const result =
          await this.dependencies.service.complete(
            decodeURIComponent(
              completeMatch[1] ?? "",
            ),
          );
        json(response, 201, result);
        return;
      }

      if (
        method === "DELETE" &&
        sessionMatch
      ) {
        await this.dependencies.service.cancel(
          decodeURIComponent(
            sessionMatch[1] ?? "",
          ),
        );
        response.statusCode = 204;
        response.end();
        return;
      }

      json(response, 404, {
        error: {
          code: "http.route-not-found",
          message: "Route not found",
        },
      });
    } catch (error) {
      json(response, 400, {
        error: {
          code:
            "master-library.resumable-upload-error",
          message:
            error instanceof Error
              ? error.message
              : "Resumable upload failed",
        },
      });
    }
  }
}
