export interface DocumentMetadata {
  readonly title: string;
  readonly mimeType: string;
  readonly language?: string;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
}
