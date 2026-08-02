import type {
  AcquisitionId,
  AnnotationId,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
} from "@knowledgeos/domain-types";
import {
  Acquisition,
  Annotation,
  KnowledgeObject,
  LocalLibrary,
  PublicationVersion,
  SourceItem,
  type AcquisitionState,
  type AnnotationState,
  type KnowledgeObjectState,
  type LocalLibraryState,
  type PublicationVersionState,
  type SourceItemState,
} from "@knowledgeos/domain";
import { decodeJson, encodeJson } from "./json.js";
import type { SqlRow } from "./sql.js";

export function knowledgeObjectToRow(value: KnowledgeObject) {
  const state = value.snapshot();
  return {
    id: state.id,
    state: encodeJson(state),
  };
}

export function knowledgeObjectFromRow(row: SqlRow): KnowledgeObject {
  return KnowledgeObject.rehydrate(
    decodeJson<KnowledgeObjectState>(row.state),
  );
}

export function sourceItemToRow(value: SourceItem) {
  const state = value.snapshot();
  return { id: state.id, state: encodeJson(state) };
}

export function sourceItemFromRow(row: SqlRow): SourceItem {
  return SourceItem.create(decodeJson<SourceItemState>(row.state));
}

export function publicationVersionToRow(value: PublicationVersion) {
  const state = value.snapshot();
  return {
    id: state.publicationId,
    state: encodeJson(state),
  };
}

export function publicationVersionFromRow(row: SqlRow): PublicationVersion {
  return PublicationVersion.create(
    decodeJson<PublicationVersionState>(row.state),
  );
}

export function localLibraryToRow(value: LocalLibrary) {
  const state = value.snapshot();
  return { id: state.id, state: encodeJson(state) };
}

export function localLibraryFromRow(row: SqlRow): LocalLibrary {
  return LocalLibrary.rehydrate(
    decodeJson<LocalLibraryState>(row.state),
  );
}

export function acquisitionToRow(value: Acquisition) {
  const state = value.snapshot();
  return { id: state.id, state: encodeJson(state) };
}

export function acquisitionFromRow(row: SqlRow): Acquisition {
  return Acquisition.rehydrate(
    decodeJson<AcquisitionState>(row.state),
  );
}

export function annotationToRow(value: Annotation) {
  const state = value.snapshot();
  return { id: state.id, state: encodeJson(state) };
}

export function annotationFromRow(row: SqlRow): Annotation {
  return Annotation.rehydrate(
    decodeJson<AnnotationState>(row.state),
  );
}

export type AggregateId =
  | KnowledgeObjectId
  | SourceItemId
  | PublicationId
  | LocalLibraryId
  | AcquisitionId
  | AnnotationId;
