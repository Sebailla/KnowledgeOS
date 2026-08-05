import assert from "node:assert/strict";
import test from "node:test";
import { createInMemoryCore } from "@knowledgeos/core";
import { CoreRouter } from "../src/router.js";
test("AI router lists models and chats",async()=>{const router=new CoreRouter(createInMemoryCore()); const models=await router.dispatch("ai.models.list",{}) as {models:unknown[]}; assert.equal(models.models.length,1); const chat=await router.dispatch("ai.chat",{message:"Explain KnowledgeOS"}) as {messages:unknown[]}; assert.equal(chat.messages.length,2);});
