import type { WorkspacePanel } from "./WorkspacePanel.js";

export interface WorkspaceTab {
  readonly id: string;
  readonly title: string;
  readonly panel: WorkspacePanel;
  readonly pinned: boolean;
}
