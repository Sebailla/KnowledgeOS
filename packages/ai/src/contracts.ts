import type { Cancellation } from "@knowledgeos/kernel";
import type { AIModel,AIRequest,AIResponse,AIEmbeddingResponse } from "./model.js";
export interface AISession { generate(request:AIRequest,options?:{readonly cancellation?:Cancellation}):Promise<AIResponse>; embed(input:readonly string[],options?:{readonly cancellation?:Cancellation}):Promise<AIEmbeddingResponse>; close():Promise<void>; }
export interface AIProvider { readonly id:string; readonly local:boolean; listModels():Promise<readonly AIModel[]>; openSession(model:AIModel):Promise<AISession>; close():Promise<void>; }
