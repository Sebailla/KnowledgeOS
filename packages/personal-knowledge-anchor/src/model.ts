import type { PublicationId, VersionId } from "@knowledgeos/domain-types";
import type { PersonalKnowledgeAnchor } from "@knowledgeos/personal-knowledge";
export type AnchorConfidence = "perfect"|"high"|"medium"|"low"|"orphan";
export type AnchorResolutionStrategy = "exact-offset"|"exact-text"|"approximate-text"|"page-position"|"structural"|"semantic"|"unresolved";
export interface VersionTextSnapshot { readonly publicationId: PublicationId; readonly versionId: VersionId; readonly text: string; readonly pageStarts?: readonly number[]; }
export interface AnchorResolution { readonly original: PersonalKnowledgeAnchor; readonly resolved?: PersonalKnowledgeAnchor; readonly strategy: AnchorResolutionStrategy; readonly confidence: AnchorConfidence; readonly score: number; readonly orphaned: boolean; readonly explanation: string; }
export interface AnchorVersionMap { readonly mapId:string; readonly itemId:string; readonly publicationId:PublicationId; readonly fromVersionId:VersionId; readonly toVersionId:VersionId; readonly originalAnchor:PersonalKnowledgeAnchor; readonly resolvedAnchor?:PersonalKnowledgeAnchor; readonly confidence:AnchorConfidence; readonly strategy:AnchorResolutionStrategy; readonly score:number; readonly createdAt:string; }
