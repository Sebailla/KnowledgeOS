import assert from "node:assert/strict"; import { LocalSearchIpcBus,decodeSearchBatchNdjson,encodeSearchBatchNdjson } from "../dist/index.js";
const bus=new LocalSearchIpcBus(); let received; const off=bus.onBatch("s1",b=>received=b); const batch={sessionId:"s1",stage:"lexical",results:[],elapsedMilliseconds:1,timedOut:false,final:false}; bus.publishBatch(batch); assert.equal(received.stage,"lexical");off();
async function* chunks(){yield encodeSearchBatchNdjson(batch).slice(0,10);yield encodeSearchBatchNdjson(batch).slice(10)} const decoded=[];for await(const b of decodeSearchBatchNdjson(chunks()))decoded.push(b);assert.equal(decoded.length,1);
console.log(JSON.stringify({flow:"ipc-ndjson-stream",status:"passed"}));
