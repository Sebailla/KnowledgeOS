import {
  createServer,
} from "node:http";
import type {
  PersonalKnowledgeProductionRuntime,
} from "@knowledgeos/personal-knowledge-sync-runtime";
import type {
  AuthenticatedPersonalKnowledgePrincipal,
} from "@knowledgeos/personal-knowledge-sync-runtime";

export interface PersonalKnowledgePrincipalResolver {
  resolve(
    authorizationHeader: string | undefined,
  ): Promise<AuthenticatedPersonalKnowledgePrincipal>;
}

export interface PersonalKnowledgeProductionServerOptions {
  readonly host: string;
  readonly port: number;
  readonly maximumBodyBytes: number;
}

export class PersonalKnowledgeProductionServer {
  public constructor(
    private readonly runtime:
      PersonalKnowledgeProductionRuntime,
    private readonly principals:
      PersonalKnowledgePrincipalResolver,
    private readonly options:
      PersonalKnowledgeProductionServerOptions,
  ) {}

  async start() {
    const server =
      createServer(
        async (
          request,
          response,
        ) => {
          try {
            const principal =
              await this.principals.resolve(
                typeof request.headers.authorization === "string"
                  ? request.headers.authorization
                  : undefined,
              );

            const url =
              new URL(
                request.url ?? "/",
                "http://localhost",
              );

            if (
              request.method === "GET" &&
              url.pathname ===
                "/v1/personal-knowledge/devices"
            ) {
              this.json(
                response,
                200,
                await this.runtime.listDevices(
                  principal,
                ),
              );
              return;
            }

            if (
              request.method === "POST" &&
              url.pathname ===
                "/v1/personal-knowledge/devices"
            ) {
              const body =
                await this.readJson(
                  request,
                );

              this.json(
                response,
                201,
                await this.runtime.registerDevice(
                  principal,
                  body as never,
                ),
              );
              return;
            }

            const revokeMatch =
              /^\/v1\/personal-knowledge\/devices\/([^/]+)$/
                .exec(url.pathname);

            if (
              request.method === "DELETE" &&
              revokeMatch
            ) {
              const revoked =
                await this.runtime.revokeDevice(
                  principal,
                  decodeURIComponent(
                    revokeMatch[1] ?? "",
                  ),
                );

              this.json(
                response,
                revoked ? 200 : 404,
                { revoked },
              );
              return;
            }

            if (
              request.method === "POST" &&
              url.pathname ===
                "/v1/personal-knowledge/events"
            ) {
              const body =
                await this.readJson(
                  request,
                ) as {
                  readonly events:
                    readonly unknown[];
                };

              this.json(
                response,
                200,
                await this.runtime.pushEvents(
                  principal,
                  body.events as never,
                ),
              );
              return;
            }

            if (
              request.method === "GET" &&
              url.pathname ===
                "/v1/personal-knowledge/events"
            ) {
              const after =
                Number(
                  url.searchParams.get(
                    "after",
                  ) ?? 0,
                );
              const limit =
                Number(
                  url.searchParams.get(
                    "limit",
                  ) ?? 100,
                );

              this.json(
                response,
                200,
                await this.runtime.pullEvents(
                  principal,
                  after,
                  limit,
                ),
              );
              return;
            }

            if (
              request.method === "GET" &&
              url.pathname ===
                "/v1/personal-knowledge/conflicts"
            ) {
              this.json(
                response,
                200,
                await this.runtime.listConflicts(
                  principal,
                ),
              );
              return;
            }

            const conflictMatch =
              /^\/v1\/personal-knowledge\/conflicts\/([^/]+)\/resolve$/
                .exec(url.pathname);

            if (
              request.method === "POST" &&
              conflictMatch
            ) {
              const body =
                await this.readJson(
                  request,
                );

              const resolved =
                await this.runtime.resolveConflict(
                  principal,
                  decodeURIComponent(
                    conflictMatch[1] ?? "",
                  ),
                  body,
                );

              this.json(
                response,
                resolved ? 200 : 404,
                { resolved },
              );
              return;
            }

            this.json(
              response,
              404,
              {
                error:
                  "not-found",
              },
            );
          } catch (error) {
            this.json(
              response,
              400,
              {
                error:
                  error instanceof Error
                    ? error.message
                    : "unknown-error",
              },
            );
          }
        },
      );

    await new Promise<void>(
      (resolve) =>
        server.listen(
          this.options.port,
          this.options.host,
          resolve,
        ),
    );

    const address =
      server.address();

    if (
      !address ||
      typeof address === "string"
    ) {
      throw new Error(
        "Unable to resolve server address",
      );
    }

    return {
      host:
        address.address,
      port:
        address.port,
      async stop() {
        await new Promise<void>(
          (resolve, reject) =>
            server.close(
              (error) =>
                error
                  ? reject(error)
                  : resolve(),
            ),
        );
      },
    };
  }

  private async readJson(
    request:
      AsyncIterable<Uint8Array>,
  ): Promise<unknown> {
    const chunks:
      Uint8Array[] = [];
    let total = 0;

    for await (
      const chunk of request
    ) {
      total += chunk.byteLength;

      if (
        total >
        this.options.maximumBodyBytes
      ) {
        throw new Error(
          "Request body is too large",
        );
      }

      chunks.push(chunk);
    }

    return JSON.parse(
      Buffer.concat(chunks)
        .toString("utf8"),
    );
  }

  private json(
    response: {
      statusCode: number;
      setHeader(
        name: string,
        value: string | number,
      ): void;
      end(data?: string): void;
    },
    statusCode: number,
    body: unknown,
  ): void {
    response.statusCode =
      statusCode;
    response.setHeader(
      "content-type",
      "application/json",
    );
    response.end(
      JSON.stringify(body),
    );
  }
}
