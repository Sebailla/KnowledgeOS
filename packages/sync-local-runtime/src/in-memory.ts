import type {
  MasterTransferDescriptor,
  PersistedTransferState,
} from "./model.js";
import type {
  TransferDescriptorRepository,
  TransferStateRepository,
} from "./contracts.js";

export class InMemoryTransferStateRepository
implements TransferStateRepository {
  private readonly values =
    new Map<string, PersistedTransferState>();

  async get(transferId: string) {
    return this.values.get(transferId);
  }

  async save(
    state: PersistedTransferState,
  ): Promise<void> {
    this.values.set(
      state.transferId,
      state,
    );
  }
}

export class InMemoryTransferDescriptorRepository
implements TransferDescriptorRepository {
  private readonly values =
    new Map<string, MasterTransferDescriptor>();

  async get(transferId: string) {
    return this.values.get(transferId);
  }

  async save(
    descriptor: MasterTransferDescriptor,
  ): Promise<void> {
    this.values.set(
      descriptor.transferId,
      descriptor,
    );
  }
}

export class InMemoryResumableLocalStaging {
  private readonly values =
    new Map<string, Uint8Array>();

  async ensure(
    transferId: string,
  ) {
    const value =
      this.values.get(transferId) ??
      new Uint8Array();

    this.values.set(
      transferId,
      value,
    );

    return {
      temporaryPath:
        `memory://${transferId}`,
      byteLength:
        value.byteLength,
    };
  }

  async append(
    transferId: string,
    expectedOffset: number,
    bytes: Uint8Array,
  ) {
    const existing =
      this.values.get(transferId) ??
      new Uint8Array();

    if (
      existing.byteLength !==
      expectedOffset
    ) {
      throw new Error(
        "Staging offset mismatch",
      );
    }

    const merged =
      Buffer.concat([
        existing,
        bytes,
      ]);

    this.values.set(
      transferId,
      merged,
    );

    return {
      temporaryPath:
        `memory://${transferId}`,
      byteLength:
        merged.byteLength,
    };
  }

  async readAll(
    transferId: string,
  ) {
    const value =
      this.values.get(transferId);

    if (!value) {
      throw new Error(
        "Staging transfer not found",
      );
    }

    return value;
  }

  async discard(
    transferId: string,
  ): Promise<void> {
    this.values.delete(transferId);
  }
}
