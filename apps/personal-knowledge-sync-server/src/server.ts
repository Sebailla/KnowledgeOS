import {
  createServer,
} from "node:http";
import type {
  PersonalKnowledgeSyncEnvelope,
} from "@knowledgeos/personal-knowledge-sync";
import type {
  PersonalKnowledgeSyncEnvelopeStore,
} from "./store.js";

export interface PersonalKnowledgeSyncServerOptions {
  readonly host: string;
  readonly port: number;
  readonly authorizationHeader: string;
}

export interface RunningPersonalKnowledgeSyncServer {
  readonly host: string;
  readonly port: number;
  stop(): Promise<void>;
}

export class PersonalKnowledgeSyncServer {
  public constructor(
    private readonly store:
      PersonalKnowledgeSyncEnvelopeStore,
    private readonly options:
      PersonalKnowledgeSyncServerOptions,
  ) {}

  async start(): Promise<
    RunningPersonalKnowledgeSyncServer
  > {
    const server =
      createServer(
        async (request, response) => {
          if (
            request.headers.authorization !==
            this.options.authorizationHeader
          ) {
            this.json(
              response,
              401,
              {
                error:
                  "unauthorized",
              },
            );
            return;
          }

          const url =
            new URL(
              request.url ?? "/",
              "http://localhost",
            );

          if (
            url.pathname !==
            "/v1/personal-knowledge/sync"
          ) {
            this.json(
              response,
              404,
              {
                error:
                  "not-found",
              },
            );
            return;
          }

          if (
            request.method === "POST"
          ) {
            const envelope =
              await this.readJson(
                request,
              ) as PersonalKnowledgeSyncEnvelope;

            const acceptedRecords =
              await this.store.push(
                envelope,
              );

            this.json(
              response,
              200,
              {
                acceptedRecords,
              },
            );
            return;
          }

          if (
            request.method === "GET"
          ) {
            const ownerId =
              url.searchParams.get(
                "ownerId",
              );
            const deviceId =
              url.searchParams.get(
                "deviceId",
              );

            if (
              !ownerId ||
              !deviceId
            ) {
              this.json(
                response,
                400,
                {
                  error:
                    "missing-query",
                },
              );
              return;
            }

            this.json(
              response,
              200,
              await this.store.pull(
                ownerId,
                deviceId,
              ),
            );
            return;
          }

          this.json(
            response,
            405,
            {
              error:
                "method-not-allowed",
            },
          );
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
        "Unable to resolve sync server address",
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
    request: AsyncIterable<Uint8Array>,
  ): Promise<unknown> {
    const chunks:
      Uint8Array[] = [];

    for await (
      const chunk of request
    ) {
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
