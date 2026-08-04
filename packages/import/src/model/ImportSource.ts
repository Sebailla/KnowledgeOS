export interface ImportSource {
  readonly id: string;
  readonly name: string;
  readonly mediaType?: string;
  readonly extension?: string;
  readonly content: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
