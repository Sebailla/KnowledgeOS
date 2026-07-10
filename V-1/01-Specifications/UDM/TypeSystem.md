
# UDM Type System

Version: 1.0

Status: Draft

---

# Objetivo

Definir el sistema de herencia utilizado por todos los nodos del UDM.

---

Object

↓

Node

↓

ContentNode

BlockNode

InlineNode

AssetNode

AnnotationNode

SemanticNode

StructuralNode

---

# Node

Todo nodo hereda:

- id
- documentId
- parentId
- nodePath
- order
- createdAt
- updatedAt
- version
- metadata
- attributes

---

# BlockNode

Representa contenido estructural.

Heredan:

- Paragraph
- Heading
- Table
- Figure
- Quote
- List
- Callout

---

# InlineNode

Representa contenido dentro de un bloque.

Heredan:

- Text
- Link
- Strong
- Emphasis
- Citation
- InlineCode

---

# AssetNode

Representa recursos binarios.

Heredan:

- Image
- Audio
- Video
- Attachment
- SVG
- Dataset

---

# AnnotationNode

Representa anotaciones.

Heredan:

- Highlight
- Bookmark
- StickyNote
- Ink
- Arrow
- Comment

---

# SemanticNode

Representa conocimiento generado.

Heredan:

- Entity
- Topic
- Concept
- Embedding
- Summary
- Relationship

---

# StructuralNode

Representa la estructura física.

Heredan:

- Page
- Column
- Region
- ReadingOrder
- BoundingBox
