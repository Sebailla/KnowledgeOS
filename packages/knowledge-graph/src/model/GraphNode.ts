export interface GraphNode {
  readonly id: string;
  readonly type: string;
  readonly label: string;
  readonly properties: Readonly<Record<string, unknown>>;
}
