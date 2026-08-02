export interface HttpRequest {
  readonly method: string;
  readonly path: string;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly body?: unknown;
  readonly query?: Readonly<Record<string, string | undefined>>;
}

export interface HttpResponse {
  readonly status: number;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: unknown;
}

export type HttpHandler = (
  request: HttpRequest,
) => Promise<HttpResponse>;

export interface HttpRouter {
  register(
    method: string,
    path: string,
    handler: HttpHandler,
  ): void;
  handle(request: HttpRequest): Promise<HttpResponse>;
}

export class InMemoryHttpRouter implements HttpRouter {
  private readonly handlers = new Map<string, HttpHandler>();

  register(
    method: string,
    path: string,
    handler: HttpHandler,
  ): void {
    const key = `${method.toUpperCase()} ${path}`;
    if (this.handlers.has(key)) {
      throw new Error(`Route already registered: ${key}`);
    }
    this.handlers.set(key, handler);
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const key = `${request.method.toUpperCase()} ${request.path}`;
    const handler = this.handlers.get(key);
    if (!handler) {
      return {
        status: 404,
        body: {
          error: {
            code: "http.route-not-found",
            message: "Route not found",
          },
        },
      };
    }
    return handler(request);
  }
}
