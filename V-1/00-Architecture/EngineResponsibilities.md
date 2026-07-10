
# Engine Responsibilities

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define las responsabilidades de cada Engine del sistema.

Cada Engine posee una única responsabilidad principal.

Los Engines colaboran mediante contratos públicos.

Ningún Engine accede directamente a la implementación interna de otro.

---

# 2. Arquitectura

```text
KnowledgeOS

                Kernel

                   │

───────────────────┼────────────────────

Library Engine

Import Engine

Render Engine

Search Engine

Annotation Engine

Knowledge Engine

AI Engine

Sync Engine

Export Engine

Plugin Engine
```

---

# 3. Reglas Generales

Todos los Engines deben cumplir:

* Alta cohesión.
* Bajo acoplamiento.
* API pública única.
* Sin dependencias circulares.
* Comunicación mediante Commands, Queries y Events.
* Persistencia únicamente mediante el Storage Layer.

---

# 4. Library Engine

## Responsabilidad

Administrar la biblioteca.

## Gestiona

* Knowledge Objects
* Collections
* Workspaces
* Metadata
* Versiones

## Publica

* KnowledgeObjectCreated
* KnowledgeObjectUpdated
* KnowledgeObjectDeleted

## Consume

* ImportCompleted
* SyncCompleted

## Nunca hace

* OCR
* IA
* Render
* Export

---

# 5. Import Engine

## Responsabilidad

Transformar fuentes externas en Knowledge Objects.

## Gestiona

* Detectores de formato
* OCR
* Parsing
* Layout Analysis
* Metadata Extraction
* Validación

## Publica

* ImportStarted
* ImportCompleted
* ImportFailed

## Consume

* ImportRequested

## Nunca hace

* Render
* Search
* IA
* Sincronización

---

# 6. Render Engine

## Responsabilidad

Construir representaciones visuales.

## Gestiona

* Editor
* Book
* Paper
* Magazine
* Original
* Preview

## Publica

* RenderCompleted

## Consume

* RenderRequested

## Nunca hace

* OCR
* Persistencia
* IA

---

# 7. Search Engine

## Responsabilidad

Buscar conocimiento.

## Gestiona

* Full Text
* Metadata
* Semantic Search
* Suggestions
* Ranking

## Publica

* IndexBuilt
* SearchCompleted

## Consume

* KnowledgeObjectCreated
* AnnotationCreated

## Nunca hace

* Render
* OCR
* Export

---

# 8. Annotation Engine

## Responsabilidad

Gestionar anotaciones.

## Gestiona

* Highlights
* Sticky Notes
* Ink
* Bookmarks
* Comments

## Publica

* AnnotationCreated
* AnnotationUpdated
* AnnotationDeleted

## Consume

* AnnotationCommands

## Nunca modifica

* UDM
* Layout
* Style

---

# 9. Knowledge Engine

## Responsabilidad

Construir el Knowledge Graph.

## Gestiona

* Entidades
* Conceptos
* Relaciones
* Backlinks
* Ontología

## Publica

* KnowledgeUpdated
* GraphUpdated

## Consume

* KnowledgeObjectUpdated
* AICompleted

## Nunca modifica

* UDM
* Assets

---

# 10. AI Engine

## Responsabilidad

Enriquecer el conocimiento.

## Gestiona

* Embeddings
* Resúmenes
* Traducciones
* Clasificaciones
* Chat
* RAG

## Publica

* AICompleted
* EmbeddingsGenerated

## Consume

* AICommands

## Nunca modifica

* Contenido UDM
* Assets

---

# 11. Sync Engine

## Responsabilidad

Sincronizar bibliotecas.

## Gestiona

* NAS
* Conflictos
* Journaling
* Versiones

## Publica

* SyncStarted
* SyncCompleted
* SyncFailed

## Consume

* SyncRequested

## Nunca hace

* OCR
* Render
* IA

---

# 12. Export Engine

## Responsabilidad

Generar formatos derivados.

## Gestiona

* Markdown
* HTML
* PDF
* EPUB

## Publica

* ExportCompleted

## Consume

* ExportRequested

## Nunca modifica

* Knowledge Objects

---

# 13. Plugin Engine

## Responsabilidad

Administrar extensiones.

## Gestiona

* Plugins
* Ciclo de vida
* Permisos
* Compatibilidad

## Publica

* PluginLoaded
* PluginStarted
* PluginStopped

## Consume

* PluginCommands

## Nunca modifica

* Núcleo
* Dominio

---

# 14. Kernel

## Responsabilidad

Coordinar el sistema.

## Gestiona

* Event Bus
* Command Bus
* Query Bus
* Scheduler
* Jobs
* Dependency Injection
* Logging
* Configuración

## Nunca contiene

* Lógica del dominio
* OCR
* IA
* Render
* Storage

---

# 15. Matriz de Dependencias

```text
Kernel
│
├── Library
├── Import
├── Render
├── Search
├── Annotation
├── Knowledge
├── AI
├── Sync
├── Export
└── Plugin
```

## Dependencias permitidas

Todos los Engines dependen únicamente de:

* Kernel
* Contracts
* Public API

## Dependencias prohibidas

Un Engine nunca depende directamente de:

* Implementaciones internas de otro Engine.
* Base de datos de otro Engine.
* Objetos internos de otro Engine.

Toda comunicación se realiza mediante contratos públicos.

---

# 16. Reglas Fundamentales

1. Un Engine tiene una única responsabilidad principal.
2. Todo Engine posee una API pública.
3. Toda comunicación ocurre mediante Commands, Queries o Events.
4. Ningún Engine modifica directamente el estado interno de otro.
5. Toda persistencia pasa por el Storage Layer.
6. Toda operación importante genera eventos.
7. El dominio permanece independiente de tecnologías.
8. Los Engines son reemplazables mientras respeten sus contratos públicos.

---

# 17. Estado

Este documento define oficialmente las responsabilidades y límites de todos los Engines de KnowledgeOS.

Cualquier modificación deberá realizarse mediante un Architecture Decision Record (ADR).
