import { CancellationNone } from "@knowledgeos/kernel";
import type { AIProvider,AISession } from "./contracts.js";
import type { AIModel,AIRequest,AIResponse,AIEmbeddingResponse } from "./model.js";
export class InMemoryAISession implements AISession {
 public constructor(private readonly model:AIModel){}
 public async generate(request:AIRequest,options:{readonly cancellation?:import("@knowledgeos/kernel").Cancellation}={}):Promise<AIResponse>{
  (options.cancellation??CancellationNone).throwIfCancellationRequested();
  const input=request.messages.map(m=>m.content).join("\n"); const content=input?`Response: ${input}`:""; const i=Math.ceil(input.length/4),o=Math.ceil(content.length/4);
  return {modelId:this.model.id,providerId:this.model.providerId,content,usage:{inputTokens:i,outputTokens:o,totalTokens:i+o},metadata:{inMemory:true}};
 }
 public async embed(input:readonly string[],options:{readonly cancellation?:import("@knowledgeos/kernel").Cancellation}={}):Promise<AIEmbeddingResponse>{
  (options.cancellation??CancellationNone).throwIfCancellationRequested();
  return {modelId:this.model.id,providerId:this.model.providerId,vectors:input.map(v=>{const a=[0,0,0,0]; for(let i=0;i<v.length;i++) a[i%4]!+=v.charCodeAt(i)/255; return a;})};
 }
 public async close():Promise<void>{}
}
export class InMemoryAIProvider implements AIProvider {
 public readonly id="in-memory"; public readonly local=true;
 public constructor(private readonly models:readonly AIModel[]=[{id:"in-memory:text",providerId:"in-memory",name:"In-Memory",local:true,contextWindow:8192,capabilities:["text-generation","embeddings","classification","structured-extraction","summarization"],metadata:{}}]){}
 public async listModels(){return this.models;} public async openSession(model:AIModel):Promise<AISession>{return new InMemoryAISession(model);} public async close():Promise<void>{}
}
