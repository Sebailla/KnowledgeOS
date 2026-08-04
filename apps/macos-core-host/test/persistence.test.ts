import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AtomicJsonStore } from "../src/persistence.js";

test("atomic store persists and restores backup", async()=>{
 const dir=await mkdtemp(join(tmpdir(),"knowledgeos-")); const file=join(dir,"state.json"); const store=new AtomicJsonStore(file,{value:0});
 await store.write({value:1}); await store.write({value:2}); assert.equal((await store.read()).value,2);
 await writeFile(file,"broken","utf8"); assert.equal((await store.read()).value,1); assert.equal(store.health().recoveredFromBackup,true); await rm(dir,{recursive:true,force:true});
});

test("backup and restore are explicit", async()=>{
 const dir=await mkdtemp(join(tmpdir(),"knowledgeos-")); const store=new AtomicJsonStore(join(dir,"state.json"),{value:0}); const backup=join(dir,"export","state.json");
 await store.write({value:7}); await store.backup(backup); await store.write({value:9}); await store.restore(backup); assert.equal((await store.read()).value,7); await rm(dir,{recursive:true,force:true});
});
