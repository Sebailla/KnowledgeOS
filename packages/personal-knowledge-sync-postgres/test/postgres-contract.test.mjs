import assert from "node:assert/strict";
import { personalKnowledgeSyncPostgresMigrations } from "../dist/index.js";
assert.equal(personalKnowledgeSyncPostgresMigrations.length,1);
const sql=personalKnowledgeSyncPostgresMigrations[0].sql;
for(const table of ["pk_devices","pk_sync_events","pk_sync_cursors","pk_refresh_tokens","pk_sync_audit"]) assert.match(sql,new RegExp(table));
console.log(JSON.stringify({flow:"personal-knowledge-postgres-schema",status:"passed"}));
