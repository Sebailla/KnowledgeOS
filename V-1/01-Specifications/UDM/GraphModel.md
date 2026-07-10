# Knowledge Graph Model

Version: 1.0

Status: Draft

---

# Objetivo

Representar todo el conocimiento contenido en la Library como un grafo.

El grafo es independiente del UDM.

El UDM describe documentos.

El Graph describe conocimiento.

---

# Componentes

Knowledge Graph

├── Nodes
├── Edges
├── Properties
├── Labels
├── Indexes
└── Embeddings

---

# Tipos de Nodo

Document

Paragraph

Table

Image

Entity

Concept

Topic

Person

Organization

Location

Species

Disease

Drug

Author

Publication

Notebook

Collection

Tag

User

Plugin

---

# Tipos de Relaciones

CONTAINS

REFERENCES

MENTIONS

CITES

BELONGS_TO

PART_OF

CREATED_BY

ANNOTATED_BY

RELATED_TO

DERIVED_FROM

SIMILAR_TO

HAS_TOPIC

HAS_ENTITY

HAS_TAG

NEXT

PREVIOUS

---

# Reglas

Todo nodo posee UUID.

Toda relación posee UUID.

Toda relación posee dirección.

Toda relación posee tipo.

Toda relación puede poseer propiedades.
