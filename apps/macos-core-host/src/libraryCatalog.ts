import {
  InMemoryLibraryCatalog,
  type LibraryItemSummary,
} from "@knowledgeos/library";

const items: readonly LibraryItemSummary[] = [
  {
    id: "publication:knowledge-os",
    title: "KnowledgeOS Architecture",
    subtitle: "Core architectural documentation",
    authors: ["KnowledgeOS Team"],
    kind: "document",
    availability: "both",
    favorite: true,
    tags: ["architecture", "knowledge"],
    createdAt: "2026-07-01T12:00:00.000Z",
    updatedAt: "2026-08-03T20:00:00.000Z",
    metadata: {
      language: "en",
      pages: 286,
    },
  },
  {
    id: "publication:offline-first",
    title: "Offline First Systems",
    subtitle: "Designing resilient local-first software",
    authors: ["Research Library"],
    kind: "book",
    availability: "local",
    favorite: false,
    tags: ["offline-first", "sync"],
    createdAt: "2026-07-12T12:00:00.000Z",
    updatedAt: "2026-08-02T18:30:00.000Z",
    metadata: {
      language: "en",
      pages: 412,
    },
  },
  {
    id: "publication:knowledge-graphs",
    title: "Personal Knowledge Graphs",
    subtitle: "Semantic organization for research",
    authors: ["Research Library"],
    kind: "paper",
    availability: "master-library",
    favorite: true,
    tags: ["graph", "semantic"],
    createdAt: "2026-07-20T12:00:00.000Z",
    updatedAt: "2026-08-01T16:00:00.000Z",
    metadata: {
      language: "en",
      pages: 28,
    },
  },
];

export const libraryCatalog =
  new InMemoryLibraryCatalog(items);
