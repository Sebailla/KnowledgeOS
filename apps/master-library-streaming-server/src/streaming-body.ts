import type {
  IncomingMessage,
} from "node:http";

export class StreamingBodyTooLargeError extends Error {
  public constructor(public readonly limit: number) {
    super(`Streaming body exceeds ${limit} bytes`);
    this.name = "StreamingBodyTooLargeError";
  }
}

export async function collectBody(
  request: IncomingMessage,
  limit: number,
): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.byteLength;
    if (size > limit) {
      throw new StreamingBodyTooLargeError(limit);
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
