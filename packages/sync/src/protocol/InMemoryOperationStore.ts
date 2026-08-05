import { checksum } from "./Canonical.js";
import type {
  OperationEnvelope,
  SyncAcknowledgement,
  SyncCheckpoint,
  SyncOperation,
} from "./Types.js";
import { UniversalSyncProtocol } from "./Protocol.js";

export class InMemoryOperationStore {
  private readonly protocol = new UniversalSyncProtocol();
  private readonly operations: SyncOperation[] = [];
  private readonly ids = new Set<string>();
  private serverSequence = 0;

  public accept(envelope: OperationEnvelope): SyncAcknowledgement {
    this.protocol.validateEnvelope(envelope);
    const accepted: string[] = [];
    const duplicates: string[] = [];
    for (const operation of envelope.batch.operations) {
      if (this.ids.has(operation.operationId)) {
        duplicates.push(operation.operationId);
        continue;
      }
      this.ids.add(operation.operationId);
      this.operations.push(operation);
      accepted.push(operation.operationId);
      this.serverSequence += 1;
    }
    return {
      batchId: envelope.batch.batchId,
      acceptedOperationIds: accepted,
      duplicateOperationIds: duplicates,
      cursor: {
        serverSequence: this.serverSequence,
        localSequence: envelope.batch.cursor.localSequence,
      },
      processedAt: new Date().toISOString(),
    };
  }

  public pull(serverSequence: number, limit = 100): readonly SyncOperation[] {
    return this.operations.slice(serverSequence, serverSequence + limit);
  }

  public checkpoint(id: string): SyncCheckpoint {
    const unsigned = {
      checkpointId: id,
      cursor: { serverSequence: this.serverSequence, localSequence: 0 },
      createdAt: new Date().toISOString(),
      operationCount: this.operations.length,
    };
    return { ...unsigned, checksum: checksum(unsigned) };
  }
}
