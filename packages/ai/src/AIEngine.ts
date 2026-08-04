import type { Engine,EngineContext,Cancellation } from "@knowledgeos/kernel";
import type { AIProvider } from "./contracts.js";
import type { AICapability,AIModel,AIPrivacyPolicy,AIRequest,AIResponse,AIEmbeddingResponse } from "./model.js";
import { defaultAIPrivacyPolicy } from "./model.js";
export class AIEngine implements Engine {
 public readonly id="ai"; public readonly name="AI Engine"; public readonly version="1.0.0"; public readonly dependencies=["search","knowledge-graph"] as const;
 private running=false; private readonly providers=new Map<string,AIProvider>(); private readonly models=new Map<string,AIModel>();
 public constructor(private readonly privacy:AIPrivacyPolicy=defaultAIPrivacyPolicy){}
 public async registerProvider(p:AIProvider){this.providers.set(p.id,p); for(const m of await p.listModels()) this.models.set(m.id,m);}
 public async initialize(c:EngineContext){c.cancellation.throwIfCancellationRequested();}
 public async start(c:EngineContext){c.cancellation.throwIfCancellationRequested(); this.running=true;}
 public async stop(_c:EngineContext){this.running=false;}
 public async dispose(_c:EngineContext){for(const p of this.providers.values()) await p.close(); this.running=false;}
 public async generate(request:AIRequest,options:{readonly cancellation?:Cancellation;readonly sensitive?:boolean;readonly capability?:AICapability}={}):Promise<AIResponse>{
  if(!this.running) throw new Error("AI Engine is not running."); const capability=options.capability??"text-generation"; const candidates=[...this.models.values()].filter(m=>m.capabilities.includes(capability)).filter(m=>m.local||(this.privacy.allowRemote&&(!(options.sensitive??false)||this.privacy.allowSensitiveDataRemote))).sort((a,b)=>this.privacy.preferLocal&&a.local!==b.local?(a.local?-1:1):a.id.localeCompare(b.id));
  if(request.modelId){const exact=candidates.filter(m=>m.id===request.modelId); candidates.splice(0,candidates.length,...exact);} if(!candidates.length) throw new Error("No eligible AI model is available."); let last:unknown;
  for(const m of candidates){try{const p=this.providers.get(m.providerId); if(!p) continue; const s=await p.openSession(m); try{return await s.generate(request,{...(options.cancellation?{cancellation:options.cancellation}:{})});} finally{await s.close();}}catch(e){last=e;}}
  throw last instanceof Error?last:new Error("No AI model could complete the request.");
 }
 public async summarize(request:AIRequest,options:{readonly cancellation?:Cancellation;readonly sensitive?:boolean}={}){return this.generate(request,{...options,capability:"summarization"});}
 public async embed(input:readonly string[],modelId?:string,options:{readonly cancellation?:Cancellation;readonly sensitive?:boolean}={}):Promise<AIEmbeddingResponse>{
  if(!this.running) throw new Error("AI Engine is not running."); const models=[...this.models.values()].filter(m=>m.capabilities.includes("embeddings")).filter(m=>!modelId||m.id===modelId).filter(m=>m.local||(this.privacy.allowRemote&&(!(options.sensitive??false)||this.privacy.allowSensitiveDataRemote))); if(!models.length) throw new Error("No eligible embedding model is available."); const m=models.sort((a,b)=>a.local===b.local?a.id.localeCompare(b.id):(a.local?-1:1))[0]!; const p=this.providers.get(m.providerId)!; const s=await p.openSession(m); try{return await s.embed(input,{...(options.cancellation?{cancellation:options.cancellation}:{})});} finally{await s.close();}
 }
}
