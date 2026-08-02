import type {
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpRouter,
} from "@knowledgeos/server";

interface Route {
  readonly method: string;
  readonly pattern: string;
  readonly regex: RegExp;
  readonly handler: HttpHandler;
}

function compile(pattern: string): RegExp {
  const escaped = pattern
    .split("/")
    .map((segment) =>
      segment.startsWith(":")
        ? "[^/]+"
        : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("/");

  return new RegExp(`^${escaped}$`);
}

export class PatternHttpRouter implements HttpRouter {
  private readonly routes: Route[] = [];

  register(
    method: string,
    path: string,
    handler: HttpHandler,
  ): void {
    this.routes.push({
      method: method.toUpperCase(),
      pattern: path,
      regex: compile(path),
      handler,
    });
  }

  async handle(
    request: HttpRequest,
  ): Promise<HttpResponse> {
    const route = this.routes.find(
      (candidate) =>
        candidate.method ===
          request.method.toUpperCase() &&
        candidate.regex.test(request.path),
    );

    if (!route) {
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

    return route.handler(request);
  }
}
