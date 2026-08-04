export type AICapability = "text-generation" | "embeddings" | "classification" | "structured-extraction" | "summarization";
export interface AIMessage { readonly role: "system"|"user"|"assistant"|"tool"; readonly content: string; }
export interface AIModel { readonly id:string; readonly providerId:string; readonly name:string; readonly local:boolean; readonly contextWindow:number; readonly capabilities:readonly AICapability[]; readonly metadata:Readonly<Record<string,unknown>>; }
export interface AIRequest { readonly modelId?:string; readonly messages:readonly AIMessage[]; readonly temperature?:number; readonly maxOutputTokens?:number; readonly metadata?:Readonly<Record<string,unknown>>; }
export interface AIResponse { readonly modelId:string; readonly providerId:string; readonly content:string; readonly usage:{readonly inputTokens:number;readonly outputTokens:number;readonly totalTokens:number}; readonly metadata:Readonly<Record<string,unknown>>; }
export interface AIEmbeddingResponse { readonly modelId:string; readonly providerId:string; readonly vectors:readonly (readonly number[])[]; }
export interface AIPrivacyPolicy { readonly allowRemote:boolean; readonly allowSensitiveDataRemote:boolean; readonly preferLocal:boolean; }
export const defaultAIPrivacyPolicy:AIPrivacyPolicy={allowRemote:true,allowSensitiveDataRemote:false,preferLocal:true};
