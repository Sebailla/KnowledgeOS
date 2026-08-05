import assert from "node:assert/strict";
import test from "node:test";
import { LocalKnowledgeGraph } from "../src/index.js";

function graph(){ const g=new LocalKnowledgeGraph(); g.rebuild([
 {id:"document:1",type:"document",label:"KnowledgeOS",properties:{}},
 {id:"concept:offline",type:"concept",label:"Offline First",properties:{}},
 {id:"tag:sync",type:"tag",label:"Sync",properties:{}},
], [
 {id:"edge:1",type:"mentions",sourceId:"document:1",targetId:"concept:offline",directed:true,properties:{}},
 {id:"edge:2",type:"taggedWith",sourceId:"document:1",targetId:"tag:sync",directed:true,properties:{}},
]); return g; }

test("graph expands and finds paths",()=>{ const g=graph(); assert.equal(g.expand("concept:offline",2).nodes.length,3); assert.equal(g.shortestPath("concept:offline","tag:sync")?.edges.length,2); });
test("graph searches and reports statistics",()=>{ const g=graph(); assert.equal(g.search("offline")[0]?.id,"concept:offline"); assert.equal(g.statistics().nodeCount,3); assert.equal(g.statistics().connectedComponents,1); });
test("node deletion removes incident edges",()=>{ const g=graph(); g.deleteNode("document:1"); assert.equal(g.statistics().edgeCount,0); });
