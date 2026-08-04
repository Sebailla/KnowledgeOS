export type WorkspacePanelKind =
  | "document"
  | "search"
  | "knowledge-graph"
  | "ai"
  | "library"
  | "custom";

export interface WorkspacePanel {
  readonly id: string;
  readonly kind: WorkspacePanelKind;
  readonly title: string;
  readonly resourceId?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
