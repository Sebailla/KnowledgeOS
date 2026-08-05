import assert from "node:assert/strict";
import test from "node:test";
import { ExportJobManager } from "../src/index.js";
const source={id:"doc:1",title:"KnowledgeOS",body:"Offline first knowledge.",metadata:{language:"en"},annotations:["note"],bookmarks:["page 1"],assets:[],graphRelations:["relatedTo:graph"],provenance:["imported"]};
test("preview reports format and options",()=>{ const manager=new ExportJobManager(); const preview=manager.preview("markdown",[source],{includeMetadata:true}); assert.equal(preview.fileName,"knowledgeos.md"); assert.equal(preview.includedSections.includes("metadata"),true); });
test("export job creates checksum and manifest",()=>{ const manager=new ExportJobManager(); const job=manager.start("html",[source],{includeAnnotations:true}); assert.equal(job.state,"completed"); assert.equal(job.result?.checksum.length,64); assert.equal(job.result?.manifest.sourceIds[0],"doc:1"); });
test("knowledge package preserves structured content",()=>{ const manager=new ExportJobManager(); const job=manager.start("knowledge-package",[source],{includeGraph:true}); assert.equal(job.result?.mediaType,"application/vnd.knowledgeos.package+json"); assert.equal(job.result?.content.includes("knowledgeos-package"),true); });
