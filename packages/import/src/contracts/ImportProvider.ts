import type { ImportSource } from "../model/ImportSource.js";

export interface ImportProvider {
  readonly id: string;
  read(source: ImportSource): Promise<string>;
  close(): Promise<void>;
}
