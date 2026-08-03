export interface SearchDocument {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
  readonly tags: readonly string[];
  readonly updatedAt: string;
}
