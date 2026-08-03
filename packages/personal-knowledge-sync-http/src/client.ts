import type {
  PersonalKnowledgeSyncEnvelope,
} from "@knowledgeos/personal-knowledge-sync";

export interface PersonalKnowledgeSyncHttpClientOptions {
  readonly baseUrl: string;
  readonly authorizationHeader: string;
}

export class PersonalKnowledgeSyncHttpClient {
  private readonly baseUrl: string;

  public constructor(
    private readonly options:
      PersonalKnowledgeSyncHttpClientOptions,
  ) {
    this.baseUrl =
      options.baseUrl.endsWith("/")
        ? options.baseUrl.slice(0, -1)
        : options.baseUrl;
  }

  async push(
    envelope:
      PersonalKnowledgeSyncEnvelope,
  ): Promise<{
    readonly acceptedRecords: number;
  }> {
    const response =
      await fetch(
        `${this.baseUrl}/v1/personal-knowledge/sync`,
        {
          method: "POST",
          headers: {
            authorization:
              this.options.authorizationHeader,
            "content-type":
              "application/json",
          },
          body:
            JSON.stringify(envelope),
        },
      );

    if (!response.ok) {
      throw new Error(
        `Personal Knowledge sync push failed: ${response.status}`,
      );
    }

    return response.json() as Promise<{
      readonly acceptedRecords: number;
    }>;
  }

  async pull(
    ownerId: string,
    deviceId: string,
  ): Promise<
    PersonalKnowledgeSyncEnvelope
  > {
    const response =
      await fetch(
        `${this.baseUrl}/v1/personal-knowledge/sync` +
        `?ownerId=${encodeURIComponent(ownerId)}` +
        `&deviceId=${encodeURIComponent(deviceId)}`,
        {
          method: "GET",
          headers: {
            authorization:
              this.options.authorizationHeader,
          },
        },
      );

    if (!response.ok) {
      throw new Error(
        `Personal Knowledge sync pull failed: ${response.status}`,
      );
    }

    return response.json() as Promise<
      PersonalKnowledgeSyncEnvelope
    >;
  }
}
