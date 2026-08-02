import type {
  UploadSessionStore,
} from "./session-store.js";

export interface CleanupClock {
  nowMilliseconds(): number;
}

export class SystemCleanupClock
implements CleanupClock {
  nowMilliseconds(): number {
    return Date.now();
  }
}

export class AbandonedUploadCleaner {
  public constructor(
    private readonly store: UploadSessionStore,
    private readonly maximumIdleMilliseconds: number,
    private readonly clock: CleanupClock =
      new SystemCleanupClock(),
  ) {}

  async clean(): Promise<readonly string[]> {
    const removed: string[] = [];
    const now = this.clock.nowMilliseconds();

    for (const session of await this.store.list()) {
      if (
        session.status === "completed" ||
        session.status === "cancelled"
      ) {
        continue;
      }

      const updated = Date.parse(
        session.updatedAt,
      );
      if (
        Number.isFinite(updated) &&
        now - updated >
          this.maximumIdleMilliseconds
      ) {
        await this.store.delete(
          session.sessionId,
        );
        removed.push(session.sessionId);
      }
    }

    return removed;
  }
}
