
# Persistence Model

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Definir qué información debe persistirse, cuál puede reconstruirse y cuál es temporal.

---

# Clasificación

## Persistente

Información que forma parte del Workspace y no puede perderse.

- Workspace
- Documents
- Collections
- Annotations
- Knowledge Objects
- Graph Nodes
- Graph Edges
- User Settings

---

## Reconstruible

Información derivada que puede regenerarse.

- Search Indexes
- Embeddings
- AI Cache
- Thumbnails
- Temporary Projections

La reconstrucción nunca debe alterar la información persistente.

---

## Temporal

Información utilizada únicamente durante la ejecución.

- Buffers
- Import Context
- Parsing State
- Rendering Cache
- Session Data

Nunca forma parte del Workspace.

---

# Reglas

- La información persistente tiene prioridad durante backups.
- La información reconstruible puede eliminarse y regenerarse.
- La información temporal nunca se persiste.

---

# Principio Fundamental

Solo se persiste aquello cuyo costo de perderlo es mayor que el costo de reconstruirlo.



| Objeto                    | Persistente | Reconstruible |
| ------------------------- | :---------: | :-----------: |
| Workspace                 |     ✅     |      ❌      |
| Document                  |     ✅     |      ❌      |
| Collection                |     ✅     |      ❌      |
| Annotation                |     ✅     |      ❌      |
| Knowledge Object          |     ✅     |      ❌      |
| **Knowledge Graph** |     ✅     |      ❌      |
| Search Index              |     ❌     |      ✅      |
| Embeddings                |     ❌     |      ✅      |
| AI Cache                  |     ❌     |      ✅      |
| Thumbnails                |     ❌     |      ✅      |
| Buffers                   |     ❌     |      ✅      |
