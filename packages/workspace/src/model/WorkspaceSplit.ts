import type { WorkspaceTab } from "./WorkspaceTab.js";

export type WorkspaceSplitDirection =
  | "horizontal"
  | "vertical";

export interface WorkspaceLeaf {
  readonly kind: "leaf";
  readonly id: string;
  readonly tabs: readonly WorkspaceTab[];
  readonly activeTabId?: string;
}

export interface WorkspaceBranch {
  readonly kind: "branch";
  readonly id: string;
  readonly direction: WorkspaceSplitDirection;
  readonly ratio: number;
  readonly first: WorkspaceNode;
  readonly second: WorkspaceNode;
}

export type WorkspaceNode =
  | WorkspaceLeaf
  | WorkspaceBranch;
