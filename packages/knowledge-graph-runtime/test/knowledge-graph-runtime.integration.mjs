import assert from "node:assert/strict";
import { InMemoryKnowledgeGraphRepository, KnowledgeGraphRuntime, PassthroughKnowledgeGraphUnitOfWork } from "../dist/index.js";
const repo=new InMemoryKnowledgeGraphRepository(); const runtime=new KnowledgeGraphRuntime(repo,new PassthroughKnowledgeGraphUnitOfWork());
const base={graphId:"graph:1",version:1,createdAt:"2026-08-01T00:00:00.000Z",updatedAt:"2026-08-01T00:00:00.000Z",labels:[],properties:{}};
await runtime.upsertNode({...base,nodeId:"node:A",type:"publication"}); await runtime.upsertNode({...base,nodeId:"node:B",type:"note"});
await runtime.upsertEdge({graphId:"graph:1",edgeId:"edge:1",fromNodeId:"node:A",toNodeId:"node:B",type:"annotates",directed:true,weight:1,properties:{},version:1,createdAt:base.createdAt,updatedAt:base.updatedAt});
const snapshot=await runtime.snapshot("graph:1","2026-08-01T01:00:00.000Z"); assert.equal(snapshot.nodes.length,2); assert.equal(snapshot.edges.length,1);
console.log(JSON.stringify({flow:"knowledge-graph-runtime-upsert-snapshot",status:"passed"}));
