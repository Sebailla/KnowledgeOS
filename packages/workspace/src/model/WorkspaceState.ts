import type { WorkspaceLayout } from "./WorkspaceLayout.js";

export interface WorkspaceState {
  readonly id: string;
  readonly name: string;
  readonly layout: WorkspaceLayout;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
