

# ADR-005 — Engine Based Architecture

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-005 v1.0

**Related Documents**

* ../ArchitectureModel.md
* ../EngineResponsibilities.md
* ../ArchitecturePrinciples.md
* ../ArchitectureConstraints.md
* ../ArchitectureVocabulary.md

---

# 1. Context

KnowledgeOS integra capacidades muy diversas:

* importación de documentos;
* representación del contenido;
* anotaciones;
* búsqueda;
* conocimiento semántico;
* inteligencia artificial;
* sincronización;
* exportación;
* extensibilidad mediante Plugins.

Implementar todas estas capacidades dentro de un único núcleo produciría un sistema altamente acoplado, difícil de mantener y de evolucionar.

Era necesario definir una unidad arquitectónica con límites claros, contratos públicos y responsabilidades únicas.

---

# 2. Decisión

KnowledgeOS adopta una **Engine Based Architecture**.

Toda funcionalidad significativa del sistema pertenece exactamente a un **Engine**.

Un Engine representa un módulo funcional autónomo que encapsula una única responsabilidad principal y expone únicamente contratos públicos.

```text
KnowledgeOS

├── Kernel
│
├── Library Engine
├── Import Engine
├── Render Engine
├── Search Engine
├── Annotation Engine
├── Knowledge Engine
├── AI Engine
├── Sync Engine
├── Export Engine
└── Plugin Engine
```

---

# 3. Motivación

La arquitectura basada en Engines permite:

* alta cohesión;
* bajo acoplamiento;
* evolución independiente;
* pruebas aisladas;
* reemplazo de implementaciones;
* incorporación de nuevas capacidades sin modificar el núcleo.

---

# 4. Detailed Design

## Definición

Un Engine es una unidad arquitectónica que:

* implementa una responsabilidad principal;
* posee estado propio cuando corresponde;
* publica contratos públicos;
* consume contratos públicos de otros Engines;
* publica eventos;
* nunca accede a implementaciones internas de otro Engine.

---

## Organización

```text
Engine

├── Public API
├── Commands
├── Queries
├── Events
├── DTOs
├── Domain Logic
└── Infrastructure Adapters
```

Toda implementación interna permanece encapsulada.

---

## Kernel

El Kernel proporciona servicios compartidos.

No contiene lógica de negocio.

El Kernel incluye:

* Command Bus;
* Query Bus;
* Event Bus;
* Workflow Engine;
* Scheduler;
* Configuration;
* Logging;
* Dependency Injection;
* Observability;
* Common Services.

El Kernel nunca conoce detalles específicos de un Engine.

---

## Library Engine

Responsabilidad:

Administrar la Library y los Knowledge Objects.

Incluye:

* creación;
* apertura;
* actualización;
* eliminación lógica;
* Collections;
* Workspaces.

No implementa sincronización.

---

## Import Engine

Responsabilidad:

Transformar fuentes externas en Knowledge Objects.

Incluye:

* Parser;
* Converter;
* OCR;
* Layout Analysis;
* Builder;
* Validation.

No administra almacenamiento permanente.

---

## Render Engine

Responsabilidad:

Representar el UDM mediante distintos Renderers.

Ejemplos:

* Editor;
* Book;
* Magazine;
* Paper;
* Web.

---

## Search Engine

Responsabilidad:

Recuperación de información.

Incluye:

* Full Text Search;
* Semantic Search;
* Metadata Search;
* Graph Search;
* Ranking.

---

## Annotation Engine

Responsabilidad:

Administrar todas las anotaciones.

Ejemplos:

* Highlight;
* Sticky Notes;
* Ink;
* Bookmarks.

Nunca modifica el contenido canónico.

---

## Knowledge Engine

Responsabilidad:

Construcción y mantenimiento del Knowledge Graph.

Incluye:

* Entities;
* Concepts;
* Relationships;
* Embeddings;
* Semantic Indexes.

El grafo siempre es derivado del UDM.

---

## AI Engine

Responsabilidad:

Integración con modelos de inteligencia artificial.

Incluye:

* Provider Manager;
* Prompt Execution;
* Embeddings;
* Chat;
* Summarization;
* Classification;
* Extraction.

La IA nunca modifica automáticamente el contenido canónico.

---

## Sync Engine

Responsabilidad:

Sincronización entre la Working Copy y la Source of Truth.

Incluye:

* Change Detection;
* Conflict Resolver;
* Merge;
* Versioning;
* Synchronization Workflow.

---

## Export Engine

Responsabilidad:

Generar formatos externos.

Ejemplos:

* Markdown;
* HTML;
* PDF;
* EPUB.

---

## Plugin Engine

Responsabilidad:

Administrar el ciclo de vida de Plugins.

Incluye:

* Discovery;
* Installation;
* Activation;
* Permissions;
* Compatibility.

---

# 5. Comunicación

Los Engines colaboran exclusivamente mediante contratos públicos.

```text
Engine A
    │
    ▼
Command
Query
Event
    │
    ▼
Engine B
```

Nunca se realizan llamadas directas a implementaciones internas.

---

# 6. Workflow Engine

Los procesos de larga duración se coordinan mediante el Workflow Engine del Kernel.

Ejemplos:

* Importación;
* Sincronización;
* Reindexación;
* Migraciones;
* Exportaciones complejas.

El Workflow Engine orquesta la ejecución.

La lógica de negocio permanece en cada Engine.

---

# 7. Dependencias

Dependencias permitidas:

* Kernel;
* Contracts;
* Public APIs;
* Domain.

Dependencias prohibidas:

* acceso directo a Infrastructure de otro Engine;
* acceso directo a repositorios internos;
* referencias circulares;
* conocimiento de implementaciones privadas.

---

# 8. Principios

Todo Engine cumple:

1. Responsabilidad única.
2. API pública estable.
3. Implementación encapsulada.
4. Comunicación mediante contratos.
5. Eventos inmutables.
6. Independencia tecnológica.
7. Evolución independiente.

---

# 9. Alternativas consideradas

## Arquitectura por capas tradicionales

Descartada.

Dificulta la evolución independiente de funcionalidades complejas.

---

## Microservicios

Descartados.

Introducen complejidad operativa incompatible con la estrategia Offline First.

---

## Arquitectura basada únicamente en paquetes

Descartada.

No proporciona límites arquitectónicos suficientemente claros.

---

# 10. Consecuencias

## Positivas

* Alta cohesión.
* Bajo acoplamiento.
* Modularidad.
* Facilidad de pruebas.
* Escalabilidad funcional.
* Reutilización.

## Negativas

* Mayor número de componentes.
* Más contratos públicos.
* Mayor disciplina arquitectónica.

---

# 11. Trade-offs

Se prioriza:

* claridad sobre simplicidad inicial;
* desacoplamiento sobre acceso directo;
* mantenibilidad sobre reducción del número de módulos;
* evolución a largo plazo sobre optimización prematura.

---

# 12. Riesgos

## Fragmentación excesiva

Mitigación:

No crear Engines para responsabilidades menores.

---

## Kernel demasiado grande

Mitigación:

El Kernel solo proporciona infraestructura compartida.

Nunca implementa lógica del dominio.

---

## Duplicación funcional

Mitigación:

Cada responsabilidad pertenece exclusivamente a un Engine.

---

# 13. Related Documents

* ArchitectureModel.md
* EngineResponsibilities.md
* ArchitecturePrinciples.md
* ArchitectureConstraints.md
* DocumentationStandards.md

---

# 14. Related ADR

* ADR-001 — Architectural Style
* ADR-003 — Offline First
* ADR-008 — Storage Architecture
* ADR-011 — Event Architecture
* ADR-012 — Public Contracts
* ADR-014 — Workflow Engine

---

# 15. Status

**Accepted**

La Engine Based Architecture constituye el modelo oficial de organización funcional de KnowledgeOS.

Toda funcionalidad significativa deberá pertenecer a un único Engine.

Las modificaciones a esta estructura requerirán un nuevo Architecture Decision Record.
