declare class Buffer extends Uint8Array {
  static from(value: string | Uint8Array, encoding?: string): Buffer;
  static concat(chunks: readonly Uint8Array[]): Buffer;
  readonly byteLength: number;
  toString(encoding?: string): string;
  subarray(start?: number, end?: number): Buffer;
}

interface AbortSignal {
  readonly aborted: boolean;
}

declare class AbortController {
  readonly signal: AbortSignal;
}
