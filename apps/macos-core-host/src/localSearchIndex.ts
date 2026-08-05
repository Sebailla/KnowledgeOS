import {
  LocalSearchIndex,
} from "@knowledgeos/search";

export const localSearchIndex =
  new LocalSearchIndex();

localSearchIndex.rebuild([
  {
    id: "publication:knowledge-os",
    title: "KnowledgeOS Architecture",
    body:
      "KnowledgeOS is an offline-first personal knowledge platform. User ownership, determinism, reproducibility and portability guide the system.",
    kind: "document",
    authors: ["KnowledgeOS Team"],
    tags: ["architecture", "knowledge"],
    availability: "both",
    updatedAt:
      "2026-08-03T20:00:00.000Z",
    metadata: {},
  },
  {
    id: "publication:offline-first",
    title: "Offline First Systems",
    body:
      "The local device remains useful without a network connection. Changes are synchronized with conflict handling.",
    kind: "book",
    authors: ["Research Library"],
    tags: ["offline-first", "sync"],
    availability: "local",
    updatedAt:
      "2026-08-02T18:30:00.000Z",
    metadata: {},
  },
  {
    id: "publication:knowledge-graphs",
    title: "Personal Knowledge Graphs",
    body:
      "Semantic relationships connect publications, concepts, notes and annotations.",
    kind: "paper",
    authors: ["Research Library"],
    tags: ["graph", "semantic"],
    availability: "master-library",
    updatedAt:
      "2026-08-01T16:00:00.000Z",
    metadata: {},
  },
]);
