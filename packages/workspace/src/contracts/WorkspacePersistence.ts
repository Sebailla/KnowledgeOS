import type { WorkspaceState } from "../model/WorkspaceState.js";

export interface WorkspacePersistence {
  get(id: string): Promise<WorkspaceState | undefined>;
  save(state: WorkspaceState): Promise<void>;
  delete(id: string): Promise<boolean>;
  list(): Promise<readonly WorkspaceState[]>;
}
