export interface OCRSource {
  readonly id: string;
  readonly mediaType: string;
  readonly content: Uint8Array;
  readonly pageCount?: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}
