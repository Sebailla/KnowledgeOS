export interface ImportDocument {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly format: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
  readonly tags: readonly string[];
}
