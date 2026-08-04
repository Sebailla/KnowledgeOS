import assert from "node:assert/strict";import test from "node:test";
import { InMemoryAIProvider } from "@knowledgeos/ai";import { CancellationNone } from "@knowledgeos/kernel";import { createSinglePanelLayout } from "@knowledgeos/workspace";import { createInMemoryCore } from "../src/index.js";
const context={cancellation:CancellationNone,metadata:{}};
const bytes=(v:string):Uint8Array=>Uint8Array.from([...v].map(c=>c.charCodeAt(0)));
test("core executes integrated workflow",async()=>{
 const core=createInMemoryCore();await core.ai.registerProvider(new InMemoryAIProvider());await core.runtime.initialize(context);await core.runtime.start(context);
 const session=await core.storage.provider.openSession();await session.put("document:1",{title:"KnowledgeOS"});
 await core.search.indexDocument({id:"document:1",title:"KnowledgeOS",body:"Offline first knowledge system",metadata:{type:"note"},tags:["knowledge"],updatedAt:"2026-08-03T00:00:00.000Z"});assert.equal((await core.search.search("offline")).total,1);
 await core.graph.upsertNode({id:"document:1",type:"document",label:"KnowledgeOS",properties:{}});await core.graph.upsertNode({id:"concept:offline-first",type:"concept",label:"Offline First",properties:{}});await core.graph.upsertEdge({id:"edge:1",type:"mentions",sourceId:"document:1",targetId:"concept:offline-first",directed:true,properties:{}});assert.equal((await core.graph.neighbors({nodeId:"document:1",direction:"out"})).length,1);
 const ocr=await core.ocr.recognize([{id:"scan:1",mediaType:"image/png",content:bytes("Scanned KnowledgeOS note"),metadata:{}}]);assert.equal(ocr.documents[0]?.text,"Scanned KnowledgeOS note");
 const ai=await core.ai.summarize({messages:[{role:"user",content:ocr.documents[0]?.text??""}]});assert.equal(ai.content.includes("Scanned KnowledgeOS note"),true);
 const layout=createSinglePanelLayout({id:"panel:document:1",kind:"document",title:"KnowledgeOS",resourceId:"document:1",metadata:{}});await core.workspace.manager.create("workspace:1","Research",layout);
 const document=await core.document.manager.create("document:1","Offline first knowledge system",{title:"KnowledgeOS",mimeType:"text/markdown",tags:["knowledge"],attributes:{}});assert.equal(document.version,1);
 const exp=await core.exporter.export([{id:"document:1",title:"KnowledgeOS",body:"Offline first knowledge system",metadata:{},assets:[]}],"markdown");assert.equal(exp.artifacts.length,1);
 await core.sync.synchronize();await session.close();await core.runtime.stop(context);await core.runtime.dispose(context);assert.equal(core.runtime.currentState,"disposed");
});
