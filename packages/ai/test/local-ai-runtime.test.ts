import assert from "node:assert/strict";
import test from "node:test";
import { LocalAIRuntime } from "../src/index.js";
const model={id:"local:text",providerId:"local",name:"Local",local:true,contextWindow:4096,capabilities:["text-generation"] as const,metadata:{}};
test("runtime selects models and stores conversations", async()=>{
 const runtime=new LocalAIRuntime([model],async(modelId)=>({modelId,providerId:"local",content:"answer",usage:{inputTokens:1,outputTokens:1,totalTokens:2},metadata:{}}));
 assert.equal(runtime.health().selectedModelId,"local:text");
 const conversation=await runtime.chat({message:"Hello"});
 assert.equal(conversation.messages.length,2);
 assert.equal(runtime.listConversations().length,1);
 assert.equal(runtime.deleteConversation(conversation.id),true);
});
