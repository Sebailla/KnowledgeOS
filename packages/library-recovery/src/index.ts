import type {
  LibraryEvent,
  LibrarySnapshot,
} from "@knowledgeos/library-contracts";

export interface LibraryRecoveryState {
  readonly snapshot: LibrarySnapshot;
  readonly replayedEventIds: readonly string[];
  readonly finalSequence: number;
}

export class LibraryRecoveryEngine {
  recover(
    snapshot: LibrarySnapshot,
    events: readonly LibraryEvent[],
  ): LibraryRecoveryState {
    const ordered =
      [...events]
        .filter(
          (event) =>
            event.ownerId === snapshot.ownerId &&
            event.sequence > snapshot.sequence,
        )
        .sort((a, b) => a.sequence - b.sequence);

    let expected = snapshot.sequence + 1;

    for (const event of ordered) {
      if (event.sequence !== expected) {
        throw new Error(
          `Journal gap: expected ${expected}, received ${event.sequence}`,
        );
      }
      expected += 1;
    }

    return {
      snapshot,
      replayedEventIds: ordered.map((event) => event.eventId),
      finalSequence: ordered.at(-1)?.sequence ?? snapshot.sequence,
    };
  }
}
