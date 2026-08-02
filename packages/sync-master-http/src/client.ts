import type {
  MasterRangeSource,
} from "@knowledgeos/sync-local-runtime";

export interface MasterHttpRangeClientOptions {
  readonly baseUrl: string;
  readonly authorizationHeader?: string;
  readonly requestTimeoutMilliseconds?: number;
}

export interface MasterHttpRequest {
  readonly signal?: AbortSignal;
}

function normalizedBaseUrl(
  value: string,
): string {
  return value.endsWith("/")
    ? value.slice(0, -1)
    : value;
}

export class MasterHttpRangeClient
implements MasterRangeSource {
  private readonly baseUrl: string;

  public constructor(
    private readonly options:
      MasterHttpRangeClientOptions,
  ) {
    this.baseUrl =
      normalizedBaseUrl(
        options.baseUrl,
      );
  }

  async describe(
    publicationId: string,
    versionId: string,
  ) {
    const response =
      await this.request(
        this.contentUrl(
          publicationId,
          versionId,
        ),
        {
          method: "HEAD",
        },
      );

    if (
      response.status !== 200
    ) {
      throw new Error(
        `Master HEAD failed with status ${response.status}`,
      );
    }

    const length =
      response.headers.get(
        "content-length",
      );
    const etag =
      response.headers.get("etag");
    const mediaType =
      response.headers.get(
        "content-type",
      ) ??
      "application/octet-stream";

    if (!length) {
      throw new Error(
        "Master response lacks Content-Length",
      );
    }

    if (!etag) {
      throw new Error(
        "Master response lacks ETag",
      );
    }

    const byteLength =
      Number(length);

    if (
      !Number.isInteger(byteLength) ||
      byteLength < 0
    ) {
      throw new Error(
        "Invalid Master Content-Length",
      );
    }

    return {
      byteLength,
      contentFingerprint:
        etag.replace(/^"|"$/g, ""),
      mediaType,
    };
  }

  async readRange(
    publicationId: string,
    versionId: string,
    start: number,
    endInclusive: number,
  ): Promise<Uint8Array> {
    if (
      !Number.isInteger(start) ||
      !Number.isInteger(endInclusive) ||
      start < 0 ||
      endInclusive < start
    ) {
      throw new Error(
        "Invalid byte range",
      );
    }

    const response =
      await this.request(
        this.contentUrl(
          publicationId,
          versionId,
        ),
        {
          method: "GET",
          headers: {
            range:
              `bytes=${start}-${endInclusive}`,
          },
        },
      );

    if (
      response.status !== 206
    ) {
      throw new Error(
        `Master range request failed with status ${response.status}`,
      );
    }

    const contentRange =
      response.headers.get(
        "content-range",
      );

    if (
      !contentRange ||
      !contentRange.startsWith(
        `bytes ${start}-${endInclusive}/`,
      )
    ) {
      throw new Error(
        "Master Content-Range mismatch",
      );
    }

    const bytes =
      Buffer.from(
        await response.arrayBuffer(),
      );

    if (
      bytes.byteLength !==
      endInclusive - start + 1
    ) {
      throw new Error(
        "Master range byte length mismatch",
      );
    }

    return bytes;
  }

  private contentUrl(
    publicationId: string,
    versionId: string,
  ): string {
    return (
      `${this.baseUrl}` +
      "/v1/master-library/publications/" +
      encodeURIComponent(publicationId) +
      "/versions/" +
      encodeURIComponent(versionId) +
      "/content"
    );
  }

  private async request(
    url: string,
    init: RequestInit,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      ...(init.headers ?? {}),
    };

    if (
      this.options.authorizationHeader
    ) {
      headers.authorization =
        this.options.authorizationHeader;
    }

    return fetch(url, {
      ...init,
      headers,
    });
  }
}
