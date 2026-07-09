
# C4 Level 3 – Knowledge Core

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Describir la estructura interna del Knowledge Core y las responsabilidades de sus principales componentes.

El Knowledge Core implementa toda la lógica de negocio de KnowledgeOS.

---

# Arquitectura

El Knowledge Core está implementado como un Modular Monolith.

Todos los componentes se ejecutan en el mismo proceso y se comunican mediante contratos públicos y eventos.

No existen dependencias directas entre Engines.

---

# Componentes

## Import Engine

Responsable de incorporar documentos externos al sistema.

Funciones:

- Importación
- OCR
- Parsing
- Conversión al UDM
- Detección de estructura
- Extracción de metadata

Publica eventos de importación.

---

## Library Engine

Gestiona la biblioteca del usuario.

Funciones:

- Library
- Workspace
- Collections
- Documentos
- Assets
- Metadata

Es el propietario del modelo de dominio principal.

---

## Search Engine

Responsable del índice de búsqueda.

Funciones:

- Indexación
- Búsqueda Full Text
- Búsqueda semántica
- Ranking
- Filtros

Puede regenerarse completamente.

---

## Render Engine

Transforma el UDM en representaciones visuales.

Formatos:

- Reader
- Book
- Magazine
- Paper
- Web
- Markdown

No modifica el UDM.

---

## Annotation Engine

Gestiona conocimiento generado por el usuario.

Funciones:

- Highlight
- Notes
- Drawings
- Apple Pencil
- Stickers
- Bookmarks

Nunca modifica el documento original.

---

## AI Engine

Orquesta todas las operaciones relacionadas con IA.

Funciones:

- Chat
- RAG
- Resúmenes
- Traducción
- Clasificación
- Extracción

Nunca modifica el conocimiento persistente.

---

## Sync Engine

Sincroniza la biblioteca.

Responsabilidades:

- NAS
- Offline First
- Resolución de conflictos
- Versionado
- Replicación

---

## Export Engine

Genera documentos derivados.

Formatos:

- Markdown
- HTML
- PDF
- EPUB

---

## Plugin Engine

Gestiona la extensibilidad.

Funciones:

- Descubrimiento
- Carga
- Ciclo de vida
- Permisos
- Sandboxing

---

## Event Bus

Infraestructura de comunicación interna.

Responsabilidades:

- Publicación de eventos
- Suscripción
- Desacoplamiento
- Orquestación

---

## Shared Kernel

Elementos compartidos entre todos los Engines.

Contiene únicamente:

- IDs
- Value Objects
- Events
- Contracts
- Result
- Option
- Errors
- Logger
- Clock
- Configuration

No contiene lógica de negocio.

---

# Reglas Arquitectónicas

1. Todo Engine posee una única responsabilidad.
2. Ningún Engine accede directamente a otro Engine.
3. Toda interacción ocurre mediante contratos públicos o eventos.
4. El Shared Kernel no contiene lógica de negocio.
5. El UDM constituye el único modelo canónico.
6. Todo acceso a infraestructura ocurre mediante abstracciones.
7. Todos los Engines son reemplazables.
8. El Core no depende de la interfaz de usuario.

---

# Dependencias

```text
UI
        │
        ▼

Knowledge Core
        │
        ├── Shared Kernel
        ├── Event Bus
        └── Engines

                │

Infrastructure

        │
        ├── Storage
        ├── AI
        ├── OCR
        ├── NAS
        └── Plugins
```

---

# Decisiones Congeladas

1. Knowledge Core es un Modular Monolith.
2. Los Engines son Componentes C4.
3. Los Engines sólo dependen de contratos públicos.
4. Event Bus es interno al Core.
5. Shared Kernel contiene únicamente elementos compartidos.
6. Toda infraestructura se abstrae mediante interfaces.
7. El Core es completamente independiente de la UI.
