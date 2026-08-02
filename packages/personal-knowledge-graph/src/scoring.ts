import type {PersonalKnowledgeItem} from "./model.js";
export function personalKnowledgeRelevance(item:PersonalKnowledgeItem,now:Date):number { const age=Math.max(0,(now.getTime()-Date.parse(item.updatedAt))/86400000); const recency=1/(1+age/30); return item.importance*0.45+item.confidence.value*0.35+recency*0.20; }
