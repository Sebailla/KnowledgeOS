import type {
  MasterTransferDescriptor,
  PersistedTransferState,
} from "./model.js";

export interface MasterRangeSource {
  describe(
    publicationId: string,
    versionId: string,
  ): Promise<{
    readonly byteLength: number;
    readonly contentFingerprint: string;
    readonly mediaType: string;
  }>;

  readRange(
    publicationId: string,
    versionId: string,
    start: number,
    endInclusive: number,
  ): Promise<Uint8Array>;
}

export interface TransferStateRepository {
  get(
    transferId: string,
  ): Promise<PersistedTransferState | undefined>;

  save(
    state: PersistedTransferState,
  ): Promise<void>;
}

export interface TransferDescriptorRepository {
  get(
    transferId: string,
  ): Promise<MasterTransferDescriptor | undefined>;
}

export interface ResumableLocalStaging {
  ensure(
    transferId: string,
  ): Promise<{
    readonly temporaryPath: string;
    readonly byteLength: number;
  }>;

  append(
    transferId: string,
    expectedOffset: number,
    bytes: Uint8Array,
  ): Promise<{
    readonly temporaryPath: string;
    readonly byteLength: number;
  }>;

  readAll(
    transferId: string,
  ): Promise<Uint8Array>;

  discard(
    transferId: string,
  ): Promise<void>;
}
