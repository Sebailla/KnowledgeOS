export interface GraphEdge {
  readonly id: string;
  readonly type: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly directed: boolean;
  readonly properties: Readonly<Record<string, unknown>>;
}
