import type {
  LibraryEvent,
} from "@knowledgeos/library-contracts";

export interface LibraryJournalRepository {
  append(
    events: readonly LibraryEvent[],
  ): Promise<void>;

  listAfter(
    ownerId: string,
    sequence: number,
  ): Promise<readonly LibraryEvent[]>;
}

export class InMemoryLibraryJournal
implements LibraryJournalRepository {
  private readonly events: LibraryEvent[] = [];

  async append(
    events: readonly LibraryEvent[],
  ): Promise<void> {
    for (const event of events) {
      const existing = this.events.find(
        (value) =>
          value.ownerId === event.ownerId &&
          value.sequence === event.sequence,
      );
      if (existing) {
        throw new Error(
          `Journal sequence already exists: ${event.ownerId}:${event.sequence}`,
        );
      }
      this.events.push(event);
    }

    this.events.sort(
      (a, b) =>
        a.ownerId.localeCompare(b.ownerId) ||
        a.sequence - b.sequence,
    );
  }

  async listAfter(
    ownerId: string,
    sequence: number,
  ) {
    return this.events.filter(
      (event) =>
        event.ownerId === ownerId &&
        event.sequence > sequence,
    );
  }
}
