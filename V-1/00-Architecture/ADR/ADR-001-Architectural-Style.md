
# ADR-001 — Architectural Style

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-001 v1.0

**Related Documents**

* ../ArchitectureModel.md
* ../ArchitecturePrinciples.md
* ../ArchitectureConstraints.md
* ../QualityAttributes.md
* ../ArchitectureVocabulary.md

---

# 1. Context

KnowledgeOS es una plataforma para gestionar conocimiento personal durante décadas.

No es un visor de documentos.

No es un editor Markdown.

No es una aplicación centrada en inteligencia artificial.

Su propósito es administrar Knowledge Objects de forma consistente, extensible y desacoplada de cualquier tecnología específica.

La arquitectura debía satisfacer simultáneamente los siguientes requisitos:

* Offline First.
* Evolución durante muchos años.
* Independencia tecnológica.
* Modularidad.
* Escalabilidad funcional.
* Extensibilidad mediante Plugins.
* Integración con múltiples proveedores externos.
* Conservación permanente del conocimiento.

Ningún estilo arquitectónico individual satisface todos estos requisitos.

Por este motivo se adopta una arquitectura híbrida.

---

# 2. Decisión

KnowledgeOS adopta una arquitectura compuesta por varios estilos complementarios.

```text
KnowledgeOS

├── Domain Driven Design
├── Clean Architecture
├── Modular Monolith
├── Engine Based Architecture
├── CQRS
├── Event Driven
├── Offline First
└── Plugin Oriented
```

Cada estilo resuelve un problema distinto.

Todos forman parte de la arquitectura oficial.

---

# 3. Motivación

No existe un único patrón capaz de resolver simultáneamente:

* complejidad del dominio;
* independencia tecnológica;
* extensibilidad;
* procesamiento de documentos;
* sincronización;
* integración con IA;
* evolución futura.

Se decidió combinar estilos ampliamente utilizados en sistemas complejos, asignando responsabilidades claras a cada uno.

---

# 4. Detailed Design

## Domain Driven Design (DDD)

El dominio constituye el centro del sistema.

Toda decisión tecnológica queda subordinada al modelo del dominio.

Los conceptos fundamentales son:

* Library
* Knowledge Object
* UDM
* Asset
* Knowledge Graph
* Collection
* Workspace

El lenguaje definido en `ArchitectureVocabulary.md` constituye el lenguaje ubicuo del proyecto.

---

## Clean Architecture

Las dependencias apuntan siempre hacia el dominio.

```text
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

El dominio nunca depende de infraestructura.

Infrastructure depende del dominio.

---

## Modular Monolith

La primera implementación será un Modular Monolith.

Cada módulo posee:

* límites claros;
* contratos públicos;
* responsabilidades definidas.

No se utilizarán microservicios durante la fase inicial del proyecto.

---

## Engine Based Architecture

La funcionalidad se divide en Engines independientes.

```text
Kernel

├── Library Engine
├── Import Engine
├── Search Engine
├── Render Engine
├── Annotation Engine
├── Knowledge Engine
├── AI Engine
├── Sync Engine
├── Export Engine
└── Plugin Engine
```

Cada Engine implementa una única responsabilidad principal.

---

## CQRS

Las operaciones de escritura y lectura se modelan de forma independiente.

Escrituras:

* Commands.

Lecturas:

* Queries.

La separación mejora mantenibilidad y escalabilidad sin introducir complejidad innecesaria.

---

## Event Driven

Los Engines colaboran publicando eventos.

Ejemplos:

* KnowledgeObjectCreated
* WorkflowCompleted
* AnnotationCreated
* SyncCompleted

Los eventos representan hechos pasados.

Son inmutables.

---

## Offline First

La ausencia de conectividad no impide utilizar el sistema.

Las funciones esenciales operan completamente sin Internet.

La sincronización constituye una capacidad adicional.

---

## Plugin Oriented

Las capacidades adicionales se incorporan mediante Plugins.

Los Plugins interactúan únicamente mediante contratos públicos.

Nunca acceden a implementaciones internas.

---

# 5. Principios derivados

Como consecuencia de este estilo arquitectónico:

* el dominio permanece independiente;
* la infraestructura puede reemplazarse;
* los Engines evolucionan de forma independiente;
* los Plugins permanecen desacoplados;
* la IA constituye una capacidad opcional;
* los Workflows coordinan procesos largos sin contener lógica de negocio.

---

# 6. Dependencias permitidas

Los módulos pueden depender únicamente de:

* Domain
* Contracts
* Public APIs
* Kernel Services

No se permiten dependencias hacia implementaciones internas de otros Engines.

---

# 7. Dependencias prohibidas

Queda prohibido:

* dependencias circulares;
* acceso directo a la base de datos de otro módulo;
* referencias a proveedores concretos dentro del dominio;
* referencias a plataformas específicas dentro del dominio;
* lógica de negocio en la interfaz de usuario.

---

# 8. Beneficios

La arquitectura elegida proporciona:

* alta cohesión;
* bajo acoplamiento;
* mantenibilidad;
* extensibilidad;
* escalabilidad funcional;
* facilidad de pruebas;
* independencia tecnológica;
* evolución controlada.

---

# 9. Alternativas consideradas

## Arquitectura en capas tradicional

Descartada.

No proporciona el desacoplamiento necesario para una plataforma de esta complejidad.

---

## Hexagonal pura

Descartada.

Resultaba insuficiente para expresar claramente la organización por Engines.

---

## Microservicios

Descartados.

Introducen complejidad operativa innecesaria para una aplicación Offline First.

---

## MVC

Descartado.

No representa adecuadamente el dominio ni las necesidades de evolución del sistema.

---

## Event Sourcing

Evaluado.

Se considera innecesario para la primera versión.

El Journal proporciona trazabilidad suficiente.

---

# 10. Consecuencias

## Positivas

* Arquitectura consistente.
* Dominio estable.
* Alta reutilización.
* Separación clara de responsabilidades.
* Menor coste de evolución.
* Mayor facilidad para incorporar nuevas capacidades.

## Negativas

* Curva de aprendizaje inicial.
* Mayor cantidad de módulos.
* Mayor disciplina arquitectónica requerida.

---

# 11. Trade-offs

Se prioriza:

* mantenibilidad sobre simplicidad inicial;
* desacoplamiento sobre rapidez de implementación;
* evolución futura sobre optimización prematura;
* claridad del dominio sobre reducción del número de componentes.

---

# 12. Riesgos

Riesgos identificados:

* proliferación excesiva de Engines;
* abuso de eventos;
* exceso de abstracciones;
* crecimiento innecesario del Kernel.

Mitigación:

* ADR obligatorios;
* revisiones arquitectónicas;
* documentación uniforme;
* contratos públicos bien definidos.

---

# 13. Related Documents

* ArchitectureModel.md
* ArchitecturePrinciples.md
* ArchitectureConstraints.md
* DomainModel.md
* EngineResponsibilities.md
* DocumentationStandards.md
* ArchitectureVocabulary.md

---

# 14. Related ADR

* ADR-002 — Universal Document Model
* ADR-003 — Offline First
* ADR-005 — Engine Based Architecture
* ADR-008 — Storage Architecture
* ADR-011 — Event Architecture
* ADR-012 — Public Contracts
* ADR-014 — Workflow Engine

---

# 15. Status

**Accepted**

Esta decisión constituye el estilo arquitectónico oficial de KnowledgeOS.

Toda modificación deberá realizarse mediante un nuevo Architecture Decision Record.
