import { ConflictEngine, InMemoryConflictRepository, type ResolutionStrategy, type SyncConflictRecord, type SyncOperation } from "@knowledgeos/sync";
const repository = new InMemoryConflictRepository();
export const conflictEngine = new ConflictEngine(repository);
export function operationFrom(value: Record<string, unknown>, prefix: "local" | "remote"): SyncOperation {
 const payload = value[`${prefix}Payload`] ?? {};
 return { operationId:String(value[`${prefix}OperationId`] ?? `${prefix}:operation`), protocolVersion:"1.0", entityType:String(value.entityType ?? "workspace") as SyncOperation["entityType"], operationType:"update", entityId:String(value.entityId ?? "entity:1"), deviceId:`${prefix}:device`, userId:"user:1", sequence:Number(value[`${prefix}Sequence`] ?? 1), timestamp:String(value[`${prefix}Timestamp`] ?? new Date().toISOString()), payload, checksum:String(value[`${prefix}Checksum`] ?? JSON.stringify(payload)) };
}
export function resolution(value: unknown): ResolutionStrategy | undefined { return typeof value === "string" ? value as ResolutionStrategy : undefined; }
export type { SyncConflictRecord };
