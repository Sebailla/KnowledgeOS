export interface ExportSource {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly assets: readonly string[];
}
