import type { StorageSession } from "../contracts/StorageSession.js";

export interface Migration {
  readonly id: string;
  readonly description: string;

  up(session: StorageSession): Promise<void>;
}
