import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type {
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  DirectMasterStorageReader,
} from "@knowledgeos/master-storage-node-stream";
import {
  parseByteRange,
  InvalidRangeError,
} from "@knowledgeos/master-library-streaming-server";

export interface DirectStreamingServerOptions {
  readonly host: string;
  readonly port: number;
}

export interface DirectStreamingDependencies {
  readonly reader: DirectMasterStorageReader;
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

async function writeChunk(
  response: ServerResponse,
  chunk: Uint8Array,
): Promise<void> {
  if (response.write(chunk)) return;
  await new Promise<void>((resolve) => {
    response.once("drain", resolve);
  });
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

export class MasterDirectStreamingServer {
  private server: Server | undefined;

  public constructor(
    private readonly dependencies: DirectStreamingDependencies,
    private readonly options: DirectStreamingServerOptions,
  ) {}

  async start(): Promise<BoundAddress> {
    if (this.server) {
      throw new Error("Server already started");
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

      const match =
        /^\/v1\/master-library\/publications\/([^/]+)\/versions\/([^/]+)\/content$/.exec(
          target,
        );

      if (
        match &&
        (method === "GET" || method === "HEAD")
      ) {
        await this.download(
          request,
          response,
          decodeURIComponent(match[1] ?? "") as PublicationId,
          decodeURIComponent(match[2] ?? "") as VersionId,
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
      if (error instanceof InvalidRangeError) {
        response.statusCode = 416;
        response.end();
        return;
      }

      json(response, 404, {
        error: {
          code: "master-library.content-not-found",
          message:
            error instanceof Error
              ? error.message
              : "Content not found",
        },
      });
    }
  }

  private async download(
    request: IncomingMessage,
    response: ServerResponse,
    publicationId: PublicationId,
    versionId: VersionId,
    headOnly: boolean,
  ): Promise<void> {
    const descriptor =
      await this.dependencies.reader.describe(
        publicationId,
        versionId,
      );

    const etag = `"${descriptor.contentFingerprint}"`;
    const ifNoneMatch =
      headerValue(request, "if-none-match");

    response.setHeader("etag", etag);
    response.setHeader("accept-ranges", "bytes");
    response.setHeader(
      "content-type",
      descriptor.mediaType,
    );

    if (ifNoneMatch === etag) {
      response.statusCode = 304;
      response.end();
      return;
    }

    const range = parseByteRange(
      headerValue(request, "range"),
      descriptor.byteLength,
    );

    const read = await this.dependencies.reader.open(
      publicationId,
      versionId,
      range,
    );

    response.statusCode = range ? 206 : 200;
    response.setHeader(
      "content-length",
      read.contentLength,
    );

    if (range) {
      response.setHeader(
        "content-range",
        `bytes ${range.start}-${range.endInclusive}/${descriptor.byteLength}`,
      );
    }

    if (headOnly) {
      response.end();
      return;
    }

    for await (const chunk of read.stream) {
      await writeChunk(response, chunk);
    }
    response.end();
  }
}
