import assert from "node:assert/strict";
import { SearchBackpressureQueue, UnifiedSearchExecutionRuntime } from "../dist/index.js";
const telemetry=[]; const batches=[]; let now=0;
const runtime=new UnifiedSearchExecutionRuntime([
 {stage:"lexical",async execute(){return [{id:"a",score:1}]}},
 {stage:"semantic",async execute(){return [{id:"b",score:.8}]}},
 {stage:"graph",async execute(){return [{id:"c",score:.7}]}}
],{async append(e){telemetry.push(e)}},{nowIso(){return "2026-08-01T00:00:00.000Z"},nowMilliseconds(){return ++now}});
await runtime.execute({sessionId:"s1",query:"heart attack",limit:10,priority:1,budgets:{lexical:50,semantic:800,graph:250}},{async publish(b){batches.push(b)}});
assert.deepEqual(batches.map(b=>b.stage),["lexical","semantic","graph"]);
assert.equal(batches.at(-1).final,true);
const q=new SearchBackpressureQueue(2); q.enqueue({...{sessionId:"a",query:"a",limit:1,budgets:{lexical:1,semantic:1,graph:1}},priority:1}); q.enqueue({...{sessionId:"b",query:"b",limit:1,budgets:{lexical:1,semantic:1,graph:1}},priority:3}); const dropped=q.enqueue({...{sessionId:"c",query:"c",limit:1,budgets:{lexical:1,semantic:1,graph:1}},priority:2}); assert.equal(dropped.sessionId,"a"); assert.equal(q.dequeue().sessionId,"b");
console.log(JSON.stringify({flow:"progressive-runtime-backpressure",status:"passed"}));
