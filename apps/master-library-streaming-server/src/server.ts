import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type {
  MasterPublicationRepository,
  MasterPublicationVersionRepository,
} from "@knowledgeos/master-library";
import type {
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import type {
  MasterRegistrationWorkflow,
} from "@knowledgeos/master-registration-workflow";
import {
  collectBody,
  StreamingBodyTooLargeError,
} from "./streaming-body.js";
import {
  parseByteRange,
  InvalidRangeError,
} from "./range.js";
import {
  parseUploadMetadata,
} from "./metadata.js";

export interface MasterStreamingServerOptions {
  readonly host: string;
  readonly port: number;
  readonly maximumUploadBytes: number;
}

export interface MasterStreamingDependencies {
  readonly registration: MasterRegistrationWorkflow;
  readonly publications: MasterPublicationRepository;
  readonly versions: MasterPublicationVersionRepository;
  readonly storage: MasterPublicationStorage;
}

export interface BoundAddress {
  readonly host: string;
  readonly port: number;
}

function headerValue(
  request: IncomingMessage,
  name: string,
): string | undefined {
  const value = request.headers[name.toLowerCase()];
  return typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value.join(",")
      : undefined;
}

function normalizedHeaders(
  request: IncomingMessage,
): Readonly<Record<string, string | undefined>> {
  const result: Record<string, string | undefined> = {};
  for (const [name, value] of Object.entries(
    request.headers,
  )) {
    result[name.toLowerCase()] =
      typeof value === "string"
        ? value
        : value === undefined
          ? undefined
          : value.join(",");
  }
  return result;
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

async function writeWithBackpressure(
  response: ServerResponse,
  data: Uint8Array,
): Promise<void> {
  if (response.write(data)) return;
  await new Promise<void>((resolve) => {
    response.once("drain", resolve);
  });
}

export class MasterLibraryStreamingServer {
  private server: Server | undefined;

  public constructor(
    private readonly dependencies: MasterStreamingDependencies,
    private readonly options: MasterStreamingServerOptions,
  ) {}

  async start(): Promise<BoundAddress> {
    if (this.server) {
      throw new Error("Streaming server already started");
    }

    const server = createServer(
      async (request, response) => {
        await this.handle(request, response);
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
    if (!address || typeof address === "string") {
      throw new Error("Unable to resolve server address");
    }

    return {
      host: address.address,
      port: address.port,
    };
  }

  async stop(): Promise<void> {
    const server = this.server;
    if (!server) return;

    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    this.server = undefined;
  }

  private async handle(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const method = request.method ?? "GET";
      const target = request.url ?? "/";

      if (
        method === "POST" &&
        target === "/v1/master-library/stream"
      ) {
        await this.handleUpload(request, response);
        return;
      }

      const contentMatch = /^\/v1\/master-library\/publications\/([^/]+)\/versions\/([^/]+)\/content$/.exec(
        target,
      );

      if (
        contentMatch &&
        (method === "GET" || method === "HEAD")
      ) {
        await this.handleDownload(
          request,
          response,
          decodeURIComponent(contentMatch[1] ?? ""),
          decodeURIComponent(contentMatch[2] ?? ""),
          method === "HEAD",
        );
        return;
      }

      if (method === "GET" && target === "/health/live") {
        json(response, 200, { state: "healthy" });
        return;
      }

      json(response, 404, {
        error: {
          code: "http.route-not-found",
          message: "Route not found",
        },
      });
    } catch (error) {
      if (error instanceof StreamingBodyTooLargeError) {
        json(response, 413, {
          error: {
            code: "master-library.upload-too-large",
            message: error.message,
          },
        });
        return;
      }

      if (error instanceof InvalidRangeError) {
        response.statusCode = 416;
        response.end();
        return;
      }

      json(response, 400, {
        error: {
          code: "master-library.streaming-error",
          message:
            error instanceof Error
              ? error.message
              : "Streaming request failed",
        },
      });
    }
  }

  private async handleUpload(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    const headers = normalizedHeaders(request);
    const metadata = parseUploadMetadata(headers);

    const contentLengthHeader =
      headerValue(request, "content-length");
    if (contentLengthHeader !== undefined) {
      const contentLength = Number(contentLengthHeader);
      if (
        !Number.isInteger(contentLength) ||
        contentLength < 0
      ) {
        throw new Error("Invalid Content-Length");
      }
      if (
        contentLength >
        this.options.maximumUploadBytes
      ) {
        throw new StreamingBodyTooLargeError(
          this.options.maximumUploadBytes,
        );
      }
    }

    const data = await collectBody(
      request,
      this.options.maximumUploadBytes,
    );

    const result =
      await this.dependencies.registration.execute({
        ...metadata,
        data,
      });

    json(response, result.duplicate ? 200 : 201, {
      publicationId: result.publicationId,
      versionId: result.versionId,
      duplicate: result.duplicate,
      fingerprint:
        result.storage.contentFingerprint,
      byteLength: result.storage.byteLength,
    });
  }

  private async handleDownload(
    request: IncomingMessage,
    response: ServerResponse,
    publicationId: string,
    versionId: string,
    headOnly: boolean,
  ): Promise<void> {
    const publication =
      await this.dependencies.publications.getById(
        publicationId as never,
      );
    const version =
      await this.dependencies.versions.get(
        versionId as never,
      );

    if (
      !publication ||
      !version ||
      version.publicationId !== publication.publicationId
    ) {
      json(response, 404, {
        error: {
          code: "master-library.content-not-found",
          message: "Publication content not found",
        },
      });
      return;
    }

    const data = await this.dependencies.storage.read(
      publication.publicationId,
      version.versionId,
    );

    const range = parseByteRange(
      headerValue(request, "range"),
      data.byteLength,
    );

    const etag = `"${version.contentFingerprint}"`;
    response.setHeader("etag", etag);
    response.setHeader("accept-ranges", "bytes");
    response.setHeader(
      "content-type",
      "application/octet-stream",
    );

    const ifNoneMatch =
      headerValue(request, "if-none-match");
    if (ifNoneMatch === etag) {
      response.statusCode = 304;
      response.end();
      return;
    }

    const body = range
      ? data.subarray(
          range.start,
          range.endInclusive + 1,
        )
      : data;

    response.statusCode = range ? 206 : 200;
    response.setHeader(
      "content-length",
      body.byteLength,
    );

    if (range) {
      response.setHeader(
        "content-range",
        `bytes ${range.start}-${range.endInclusive}/${data.byteLength}`,
      );
    }

    if (headOnly) {
      response.end();
      return;
    }

    await writeWithBackpressure(response, body);
    response.end();
  }
}
