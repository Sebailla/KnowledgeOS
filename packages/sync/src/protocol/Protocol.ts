import { checksum } from "./Canonical.js";
import {
  USP_VERSION,
  type OperationBatch,
  type OperationEnvelope,
  type ProtocolCompatibility,
  type SyncOperation,
} from "./Types.js";

export class UniversalSyncProtocol {
  public compatibility(version: string): ProtocolCompatibility {
    return {
      supported: version === USP_VERSION,
      requestedVersion: version,
      supportedVersions: [USP_VERSION],
    };
  }

  public createOperation(input: Omit<SyncOperation, "protocolVersion" | "checksum">): SyncOperation {
    const unsigned = { ...input, protocolVersion: USP_VERSION };
    return { ...unsigned, checksum: checksum(unsigned) };
  }

  public createBatch(input: Omit<OperationBatch, "protocolVersion" | "checksum">): OperationBatch {
    const unsigned = { ...input, protocolVersion: USP_VERSION };
    return { ...unsigned, checksum: checksum(unsigned) };
  }

  public createEnvelope(input: Omit<OperationEnvelope, "protocolVersion" | "checksum">): OperationEnvelope {
    const unsigned = { ...input, protocolVersion: USP_VERSION };
    return { ...unsigned, checksum: checksum(unsigned) };
  }

  public validateOperation(operation: SyncOperation): void {
    this.assertVersion(operation.protocolVersion);
    const { checksum: supplied, ...unsigned } = operation;
    if (checksum(unsigned) !== supplied) throw new Error("SYNC_OPERATION_CHECKSUM_INVALID");
    if (!operation.operationId || !operation.entityId || operation.sequence < 0) {
      throw new Error("SYNC_OPERATION_INVALID");
    }
  }

  public validateBatch(batch: OperationBatch): void {
    this.assertVersion(batch.protocolVersion);
    const { checksum: supplied, ...unsigned } = batch;
    if (checksum(unsigned) !== supplied) throw new Error("SYNC_BATCH_CHECKSUM_INVALID");
    for (const operation of batch.operations) this.validateOperation(operation);
    for (let index = 1; index < batch.operations.length; index += 1) {
      if (batch.operations[index]!.sequence < batch.operations[index - 1]!.sequence) {
        throw new Error("SYNC_BATCH_OUT_OF_ORDER");
      }
    }
  }

  public validateEnvelope(envelope: OperationEnvelope): void {
    this.assertVersion(envelope.protocolVersion);
    const { checksum: supplied, ...unsigned } = envelope;
    if (checksum(unsigned) !== supplied) throw new Error("SYNC_ENVELOPE_CHECKSUM_INVALID");
    this.validateBatch(envelope.batch);
  }

  private assertVersion(version: string): void {
    if (version !== USP_VERSION) throw new Error("SYNC_PROTOCOL_VERSION_UNSUPPORTED");
  }
}
