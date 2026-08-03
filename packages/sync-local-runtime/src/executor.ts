import type {
  CommitLocalAcquisitionService,
} from "@knowledgeos/local-library";
import type {
  MasterRangeSource,
  ResumableLocalStaging,
  TransferDescriptorRepository,
  TransferStateRepository,
} from "./contracts.js";
import type {
  PersistedTransferState,
  TransferExecutionResult,
} from "./model.js";

export interface SyncLocalExecutorOptions {
  readonly chunkBytes: number;
}

export interface SyncLocalClock {
  nowIso(): string;
}

export class SyncToLocalTransferExecutor {
  public constructor(
    private readonly descriptors:
      TransferDescriptorRepository,
    private readonly states:
      TransferStateRepository,
    private readonly source:
      MasterRangeSource,
    private readonly staging:
      ResumableLocalStaging,
    private readonly acquisition:
      CommitLocalAcquisitionService,
    private readonly clock:
      SyncLocalClock,
    private readonly options:
      SyncLocalExecutorOptions,
  ) {
    if (
      !Number.isInteger(
        options.chunkBytes,
      ) ||
      options.chunkBytes < 1
    ) {
      throw new Error(
        "chunkBytes must be a positive integer",
      );
    }
  }

  async execute(
    transferId: string,
    signal:
      AbortSignal =
        new AbortController().signal,
  ): Promise<TransferExecutionResult> {
    const descriptor =
      await this.descriptors.get(
        transferId,
      );

    if (!descriptor) {
      throw new Error(
        `Transfer descriptor not found: ${transferId}`,
      );
    }

    const remote =
      await this.source.describe(
        descriptor.publicationId,
        descriptor.versionId,
      );

    if (
      remote.byteLength !==
      descriptor.byteLength
    ) {
      throw new Error(
        "Master byte length changed",
      );
    }

    if (
      remote.contentFingerprint !==
      descriptor.contentFingerprint
    ) {
      throw new Error(
        "Master fingerprint changed",
      );
    }

    const staged =
      await this.staging.ensure(
        transferId,
      );

    let state =
      await this.states.get(
        transferId,
      );

    if (!state) {
      state = {
        transferId:
          descriptor.transferId,
        planId:
          descriptor.planId,
        receivedBytes:
          staged.byteLength,
        totalBytes:
          descriptor.byteLength,
        completed:
          false,
        checksumVerified:
          false,
        temporaryPath:
          staged.temporaryPath,
        updatedAt:
          this.clock.nowIso(),
      };

      await this.states.save(state);
    }

    if (
      state.totalBytes !==
      descriptor.byteLength
    ) {
      throw new Error(
        "Persisted total bytes changed",
      );
    }

    if (
      staged.byteLength !==
      state.receivedBytes
    ) {
      throw new Error(
        "Checkpoint and staging length diverged",
      );
    }

    if (state.completed) {
      return {
        transferId,
        receivedBytes:
          state.receivedBytes,
        totalBytes:
          state.totalBytes,
        completed:
          true,
        checksumVerified:
          state.checksumVerified,
      };
    }

    while (
      state.receivedBytes <
      state.totalBytes
    ) {
      if (signal.aborted) {
        return {
          transferId,
          receivedBytes:
            state.receivedBytes,
          totalBytes:
            state.totalBytes,
          completed:
            false,
          checksumVerified:
            false,
        };
      }

      const start =
        state.receivedBytes;
      const endInclusive =
        Math.min(
          state.totalBytes - 1,
          start +
            this.options.chunkBytes -
            1,
        );

      const bytes =
        await this.source.readRange(
          descriptor.publicationId,
          descriptor.versionId,
          start,
          endInclusive,
        );

      const expectedLength =
        endInclusive - start + 1;

      if (
        bytes.byteLength !==
        expectedLength
      ) {
        throw new Error(
          "Master range length mismatch",
        );
      }

      const appended =
        await this.staging.append(
          transferId,
          start,
          bytes,
        );

      const next:
        PersistedTransferState = {
          ...state,
          receivedBytes:
            appended.byteLength,
          temporaryPath:
            appended.temporaryPath,
          updatedAt:
            this.clock.nowIso(),
        };

      if (
        next.receivedBytes <
        state.receivedBytes
      ) {
        throw new Error(
          "Transfer progress moved backwards",
        );
      }

      await this.states.save(next);
      state = next;
    }

    const data =
      await this.staging.readAll(
        transferId,
      );

    const record =
      await this.acquisition.execute({
        localLibraryId:
          descriptor.localLibraryId,
        publicationId:
          descriptor.publicationId,
        knowledgeObjectId:
          descriptor.knowledgeObjectId,
        versionId:
          descriptor.versionId,
        sourceItemId:
          descriptor.sourceItemId,
        title:
          descriptor.title,
        mediaType:
          descriptor.mediaType,
        data,
        expectedFingerprint:
          descriptor.contentFingerprint,
        expectedByteLength:
          descriptor.byteLength,
      });

    if (!record.readableOffline) {
      throw new Error(
        "Local commit did not become readable offline",
      );
    }

    const completed:
      PersistedTransferState = {
        ...state,
        receivedBytes:
          descriptor.byteLength,
        completed:
          true,
        checksumVerified:
          true,
        updatedAt:
          this.clock.nowIso(),
      };

    await this.states.save(
      completed,
    );
    await this.staging.discard(
      transferId,
    );

    return {
      transferId,
      receivedBytes:
        completed.receivedBytes,
      totalBytes:
        completed.totalBytes,
      completed:
        true,
      checksumVerified:
        true,
    };
  }
}
