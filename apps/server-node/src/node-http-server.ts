import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type {
  HttpRequest,
  HttpResponse,
  HttpRouter,
} from "@knowledgeos/server";
import {
  readJsonBody,
  RequestBodyTooLargeError,
} from "./body-reader.js";
import { parseRequestTarget } from "./query-string.js";

export interface NodeHttpServerOptions {
  readonly host: string;
  readonly port: number;
  readonly requestBodyLimitBytes: number;
}

export interface BoundServerAddress {
  readonly host: string;
  readonly port: number;
}

function normalizedHeaders(
  request: IncomingMessage,
): Readonly<Record<string, string | undefined>> {
  const result: Record<string, string | undefined> = {};

  for (const [name, value] of Object.entries(request.headers)) {
    result[name.toLowerCase()] =
      typeof value === "string"
        ? value
        : value === undefined
          ? undefined
          : value.join(",");
  }

  return result;
}

function writeResponse(
  response: ServerResponse,
  result: HttpResponse,
): void {
  response.statusCode = result.status;

  for (const [name, value] of Object.entries(
    result.headers ?? {},
  )) {
    response.setHeader(name, value);
  }

  if (result.body === undefined) {
    response.end();
    return;
  }

  response.setHeader(
    "content-type",
    "application/json; charset=utf-8",
  );
  response.end(JSON.stringify(result.body));
}

export class NodeHttpServer {
  private server: Server | undefined;

  public constructor(
    private readonly router: HttpRouter,
    private readonly options: NodeHttpServerOptions,
  ) {}

  async start(): Promise<BoundServerAddress> {
    if (this.server) {
      throw new Error("HTTP server already started");
    }

    const server = createServer(async (request, response) => {
      await this.handleRequest(request, response);
    });
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
      throw new Error("Unable to resolve bound server address");
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

  private async handleRequest(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const method = request.method ?? "GET";
      const target = parseRequestTarget(request.url ?? "/");
      const body =
        method === "GET" || method === "HEAD"
          ? undefined
          : await readJsonBody(
              request,
              this.options.requestBodyLimitBytes,
            );

      const httpRequest: HttpRequest = {
        method,
        path: target.path,
        headers: normalizedHeaders(request),
        ...(Object.keys(target.query).length === 0
          ? {}
          : { query: target.query }),
        ...(body === undefined ? {} : { body }),
      };

      writeResponse(
        response,
        await this.router.handle(httpRequest),
      );
    } catch (error) {
      if (error instanceof RequestBodyTooLargeError) {
        writeResponse(response, {
          status: 413,
          body: {
            error: {
              code: "http.request-body-too-large",
              message: error.message,
            },
          },
        });
        return;
      }

      if (error instanceof SyntaxError) {
        writeResponse(response, {
          status: 400,
          body: {
            error: {
              code: "http.invalid-json",
              message: "Request body is not valid JSON",
            },
          },
        });
        return;
      }

      writeResponse(response, {
        status: 500,
        body: {
          error: {
            code: "http.runtime-error",
            message: "HTTP runtime failed to process request",
          },
        },
      });
    }
  }
}
