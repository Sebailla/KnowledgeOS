import type { PersonalKnowledgeItem } from "@knowledgeos/personal-knowledge";
export type PersonalKnowledgeConflictState="local-edit"|"remote-edit"|"merged"|"conflict"|"orphan";
export interface PersonalKnowledgeConflict{readonly conflictId:string;readonly itemId:string;readonly baseRevision:number;readonly local:PersonalKnowledgeItem;readonly remote:PersonalKnowledgeItem;readonly state:PersonalKnowledgeConflictState;readonly detectedAt:string;readonly resolvedAt?:string;}
export interface PersonalKnowledgeManifestEntry{readonly itemId:string;readonly revision:number;readonly deleted:boolean;readonly updatedAt:string;}
export interface PersonalKnowledgeManifest{readonly ownerId:string;readonly deviceId:string;readonly generatedAt:string;readonly entries:readonly PersonalKnowledgeManifestEntry[];}
