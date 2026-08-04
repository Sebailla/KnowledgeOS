import type { WorkspaceNode } from "./WorkspaceSplit.js";

export interface WorkspaceLayout {
  readonly root: WorkspaceNode;
  readonly focusedPanelId?: string;
}
