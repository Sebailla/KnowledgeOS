import assert from "node:assert/strict";
import { JsonKnowledgeGraphSerializer, validateKnowledgeGraphSnapshot } from "../dist/index.js";
const snapshot={graphId:"graph:1",createdAt:"2026-08-01T00:00:00.000Z",nodes:[{graphId:"graph:1",nodeId:"node:A",type:"publication",labels:["Paper"],properties:{title:"A"},version:1,createdAt:"2026-08-01T00:00:00.000Z",updatedAt:"2026-08-01T00:00:00.000Z"},{graphId:"graph:1",nodeId:"node:B",type:"note",labels:["Note"],properties:{},version:1,createdAt:"2026-08-01T00:00:00.000Z",updatedAt:"2026-08-01T00:00:00.000Z"}],edges:[{graphId:"graph:1",edgeId:"edge:1",fromNodeId:"node:A",toNodeId:"node:B",type:"annotates",directed:true,weight:1,properties:{},version:1,createdAt:"2026-08-01T00:00:00.000Z",updatedAt:"2026-08-01T00:00:00.000Z"}]};
validateKnowledgeGraphSnapshot(snapshot);
const serializer=new JsonKnowledgeGraphSerializer();
assert.deepEqual(serializer.deserialize(serializer.serialize(snapshot)),snapshot);
console.log(JSON.stringify({flow:"knowledge-graph-validation-serialization",status:"passed"}));
