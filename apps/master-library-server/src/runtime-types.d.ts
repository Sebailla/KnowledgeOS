declare class Buffer extends Uint8Array {
  static from(
    value: string | Uint8Array,
    encoding?: string,
  ): Buffer;
  toString(encoding?: string): string;
}
