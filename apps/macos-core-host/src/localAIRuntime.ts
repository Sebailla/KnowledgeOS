import { LocalAIRuntime, type AIContextSource } from "@knowledgeos/ai";
import { localSearchIndex } from "./localSearchIndex.js";
import { localKnowledgeGraph } from "./localKnowledgeGraph.js";

const model={id:"in-memory:text",providerId:"in-memory",name:"KnowledgeOS Local",local:true,contextWindow:8192,capabilities:["text-generation","summarization"] as const,metadata:{privacy:"local"}};
export const localAIRuntime=new LocalAIRuntime([model],async(modelId,messages)=>{
 const latest=[...messages].reverse().find((message)=>message.role==="user")?.content ?? "";
 return {modelId,providerId:"in-memory",content:`Local response: ${latest}`,usage:{inputTokens:Math.ceil(latest.length/4),outputTokens:Math.ceil((16+latest.length)/4),totalTokens:Math.ceil(latest.length/2)},metadata:{local:true}};
});

export function buildAIContext(query:string): readonly AIContextSource[] {
 const search=localSearchIndex.search({text:query,pageSize:3}).items.map((item)=>({id:item.id,title:item.title,kind:"search" as const,excerpt:item.snippet}));
 const graph=localKnowledgeGraph.search(query).slice(0,3).map((node)=>({id:node.id,title:node.label,kind:"graph" as const,excerpt:`${node.type}: ${node.label}`}));
 return [...search,...graph];
}
