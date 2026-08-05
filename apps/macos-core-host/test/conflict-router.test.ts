import assert from "node:assert/strict";
import test from "node:test";
import { createInMemoryCore } from "@knowledgeos/core";
import { CoreRouter } from "../src/router.js";
test("host detects and resolves conflict", async () => {
 const router=new CoreRouter(createInMemoryCore());
 const detected=await router.dispatch("conflict.detect",{entityType:"reading-position",entityId:"doc:1",localPayload:{page:1},remotePayload:{page:2},localChecksum:"a",remoteChecksum:"b"}) as any;
 assert.equal(detected.conflict.status,"pending");
 const resolved=await router.dispatch("conflict.resolve",{id:detected.conflict.id}) as any;
 assert.equal(resolved.status,"resolved");
});
