import assert from "node:assert/strict";
import test from "node:test";
import { ConflictEngine, InMemoryConflictRepository, type SyncOperation } from "../src/index.js";
const operation = (id: string, entityType: SyncOperation["entityType"], payload: unknown, checksum: string): SyncOperation => ({ operationId:id, protocolVersion:"1.0", entityType, operationType:"update", entityId:"entity:1", deviceId:id, userId:"user:1", sequence:1, timestamp:id === "local" ? "2026-08-04T10:00:00Z" : "2026-08-04T11:00:00Z", payload, checksum });
test("reading position resolves last write wins", async () => {
 const engine=new ConflictEngine(new InMemoryConflictRepository(),()=>"2026-08-04T12:00:00Z");
 const conflict=await engine.detect(operation("local","reading-position",{page:1},"a"),operation("remote","reading-position",{page:2},"b"));
 assert.equal(conflict?.suggestedStrategy,"last-write-wins");
 const resolved=await engine.resolve(conflict!.id);
 assert.deepEqual(resolved.result,{page:2});
});
test("workspace remains manual", async () => {
 const engine=new ConflictEngine(new InMemoryConflictRepository());
 const conflict=await engine.detect(operation("local","workspace",{name:"A"},"a"),operation("remote","workspace",{name:"B"},"b"));
 const preview=await engine.preview(conflict!.id);
 assert.equal(preview.automatic,false);
});
