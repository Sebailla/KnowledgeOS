import type { AcquisitionId, AnnotationId, KnowledgeObjectId, LocalLibraryId, PublicationId, SourceItemId } from "@knowledgeos/domain-types";
import type { Acquisition } from "./acquisition.js"; import type { Annotation } from "./annotation.js"; import type { KnowledgeObject } from "./knowledge-object.js"; import type { LocalLibrary } from "./local-library.js"; import type { PublicationVersion } from "./publication-version.js"; import type { SourceItem } from "./source-item.js";
export interface KnowledgeObjectRepository{get(id:KnowledgeObjectId):Promise<KnowledgeObject|undefined>;save(value:KnowledgeObject):Promise<void>;}
export interface SourceItemRepository{get(id:SourceItemId):Promise<SourceItem|undefined>;save(value:SourceItem):Promise<void>;}
export interface PublicationVersionRepository{get(id:PublicationId):Promise<PublicationVersion|undefined>;save(value:PublicationVersion):Promise<void>;}
export interface LocalLibraryRepository{get(id:LocalLibraryId):Promise<LocalLibrary|undefined>;save(value:LocalLibrary):Promise<void>;}
export interface AcquisitionRepository{get(id:AcquisitionId):Promise<Acquisition|undefined>;save(value:Acquisition):Promise<void>;}
export interface AnnotationRepository{get(id:AnnotationId):Promise<Annotation|undefined>;save(value:Annotation):Promise<void>;}
