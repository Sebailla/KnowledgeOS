import type { IncomingMessage } from "node:http";

export class RequestBodyTooLargeError extends Error {
  public constructor(public readonly limit: number) {
    super(`Request body exceeds ${limit} bytes`);
    this.name = "RequestBodyTooLargeError";
  }
}

export async function readJsonBody(
  request: IncomingMessage,
  limit: number,
): Promise<unknown> {
  const chunks: Uint8Array[] = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.byteLength;
    if (size > limit) {
      throw new RequestBodyTooLargeError(limit);
    }
    chunks.push(chunk);
  }

  if (size == 0) return undefined;

  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) return undefined;

  return JSON.parse(text) as unknown;
}
