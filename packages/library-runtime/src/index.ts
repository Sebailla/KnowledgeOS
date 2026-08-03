import type {
  LibrarySnapshot,
  LibraryTransaction,
} from "@knowledgeos/library-contracts";
import {
  LibraryIntegrityChecker,
} from "@knowledgeos/library-integrity";
import {
  LibraryTransactionEngine,
} from "@knowledgeos/library-transactions";

export interface LibraryPersistencePort {
  loadState(ownerId: string): Promise<{
    readonly objects: readonly import("@knowledgeos/library-contracts").LibraryObject[];
    readonly relationships:
      readonly import("@knowledgeos/library-contracts").LibraryRelationship[];
    readonly sequence: number;
  }>;

  saveObject(
    object: import("@knowledgeos/library-contracts").LibraryObject,
  ): Promise<void>;

  saveRelationship(
    relationship: import("@knowledgeos/library-contracts").LibraryRelationship,
  ): Promise<void>;

  appendEvents(
    events: readonly import("@knowledgeos/library-contracts").LibraryEvent[],
  ): Promise<void>;

  saveSnapshot(snapshot: LibrarySnapshot): Promise<void>;
}

export interface LibraryRuntimeClock {
  nowIso(): string;
}

export class LibraryRuntime {
  private readonly transactions =
    new LibraryTransactionEngine();
  private readonly integrity =
    new LibraryIntegrityChecker();

  public constructor(
    private readonly persistence: LibraryPersistencePort,
    private readonly clock: LibraryRuntimeClock,
  ) {}

  async commit(
    transaction: LibraryTransaction,
  ) {
    const state =
      await this.persistence.loadState(
        transaction.ownerId,
      );

    const result =
      this.transactions.apply(
        state,
        transaction,
      );

    const issues =
      this.integrity.check(
        result.state.objects,
        result.state.relationships,
      );

    if (issues.length > 0) {
      throw new Error(
        issues
          .map((issue) => `${issue.code}:${issue.subjectId}`)
          .join(","),
      );
    }

    for (const object of result.state.objects) {
      await this.persistence.saveObject(object);
    }

    for (const relationship of result.state.relationships) {
      await this.persistence.saveRelationship(relationship);
    }

    await this.persistence.appendEvents(result.events);

    return result;
  }

  async snapshot(
    ownerId: string,
    snapshotId: string,
  ): Promise<LibrarySnapshot> {
    const state =
      await this.persistence.loadState(ownerId);

    const snapshot: LibrarySnapshot = {
      snapshotId,
      ownerId,
      sequence: state.sequence,
      objects: state.objects,
      relationships: state.relationships,
      createdAt: this.clock.nowIso(),
    };

    const issues =
      this.integrity.validateSnapshot(snapshot);

    if (issues.length > 0) {
      throw new Error(
        issues.map((issue) => issue.code).join(","),
      );
    }

    await this.persistence.saveSnapshot(snapshot);
    return snapshot;
  }
}
