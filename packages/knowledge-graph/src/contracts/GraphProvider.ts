import type { GraphStore } from "./GraphStore.js";

export interface GraphProvider {
  readonly id: string;
  openGraph(name: string): Promise<GraphStore>;
  close(): Promise<void>;
}
