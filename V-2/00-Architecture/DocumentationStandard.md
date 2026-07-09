# Documentation Standard

Versión: 1.0
Estado: Approved

---

# 1. Propósito

Este documento define el estándar oficial para toda la documentación de KnowledgeOS.

Todos los documentos del proyecto deberán seguir este estándar.

Los objetivos son:

- Consistencia
- Escalabilidad
- Trazabilidad
- Facilidad de navegación
- Mantenibilidad

---

# 2. Principios

Toda la documentación debe ser:

- Clara
- Modular
- Atómica
- Versionable
- Referenciable
- Tecnológicamente independiente cuando sea posible

---

# 3. Estructura del repositorio

docs/

00-Architecture/
01-Platform/
02-Product/
03-MVP/
04-Research/
05-API/
06-Development/
07-Releases/

---

# 4. Estado de los documentos

Todo documento debe tener uno de los siguientes estados:

Draft

Documento en construcción.

Review

Documento pendiente de revisión.

Approved

Documento oficial.

Deprecated

Documento reemplazado.

Archived

Documento histórico.

---

# 5. Versionado

Formato:

Major.Minor

Ejemplos:

1.0

1.1

2.0

Cambios mayores modifican arquitectura.

Cambios menores agregan contenido.

---

# 6. Encabezado obligatorio

Todo documento comienza con:

# Título

Versión:

Estado:

Última actualización:

Autor:

Documentos relacionados:

---

# 7. Organización

Un documento debe tratar un único tema.

Nunca mezclar:

- arquitectura
- UX
- implementación
- negocio

en el mismo documento.

---

# 8. Tamaño recomendado

Ideal:

300–1200 líneas.

Si supera ese tamaño debe dividirse.

---

# 9. Convenciones de nombres

PascalCase.

Ejemplos:

KnowledgeEngine.md

RenderingEngine.md

DocumentPipeline.md

Nunca:

knowledge_engine.md

render.md

doc1.md

---

# 10. Cross References

Siempre utilizar referencias explícitas.

Ejemplo:

Relacionado:

- Vision.md
- GraphArchitecture.md
- ADR-003

Nunca duplicar información.

---

# 11. Diagramas

Utilizar:

Mermaid

Markdown

Tablas

Diagramas ASCII

No incluir imágenes cuando un diagrama textual sea suficiente.

---

# 12. Código

El código incluido debe ser:

- ilustrativo
- incompleto
- independiente del lenguaje cuando sea posible

La documentación no reemplaza al código fuente.

---

# 13. ADR

Toda decisión importante debe tener un ADR.

Los documentos no deben justificar decisiones.

Solo referenciar el ADR correspondiente.

---

# 14. Glosario

Todo término nuevo debe agregarse primero a:

Glossary.md

No crear definiciones locales.

---

# 15. Diagramas de arquitectura

Toda arquitectura debe responder:

Qué hace

Por qué existe

Entradas

Salidas

Dependencias

Eventos

Errores

---

# 16. Documentos futuros

Cada nuevo documento debe responder:

¿Por qué existe?

¿Qué problema resuelve?

¿Cómo interactúa con el resto?

¿Qué decisiones importantes contiene?

---

# 17. Regla de oro

Si una información ya existe en otro documento:

No copiarla.

Referenciarla.

Existe una única fuente de verdad para cada concepto.

---

# 18. Definición de terminado

Un documento se considera completo cuando:

Tiene propósito claro.

No contradice otros documentos.

Está referenciado.

Tiene versión.

Tiene estado.

Tiene relaciones.

Puede entenderse de forma aislada.

---

# 19. Principio fundamental

La documentación es parte del producto.

No describe el sistema.

El sistema se construye siguiendo la documentación.

## 20. Diagramas

### Objetivo

Todos los diagramas oficiales de KnowledgeOS deben mantenerse como artefactos independientes del texto para facilitar su reutilización, validación y generación automática.

### Estándar

- PlantUML es el lenguaje oficial para todos los diagramas.
- Los archivos `.puml` son la fuente de verdad.
- Los documentos Markdown no contienen diagramas embebidos; únicamente describen el contexto y referencian el diagrama correspondiente.

### Ubicación

docs/
└── diagrams/
    ├── architecture/
    ├── platform/
    ├── kernel/
    └── engines/

### Convención de nombres

SD-xxx → Sequence Diagram

ST-xxx → State Diagram

CD-xxx → Class Diagram

CMP-xxx → Component Diagram

ACT-xxx → Activity Diagram

DEP-xxx → Deployment Diagram

### Reglas

- Un diagrama por archivo.
- Todo diagrama debe estar versionado junto con el código.
- Todo diagrama debe mantenerse sincronizado con la documentación.
- Los diagramas forman parte de la documentación oficial del proyecto.

# 21. Diagram Abstraction Rule

## Purpose

Architecture diagrams describe responsibilities and boundaries.

They do not describe concrete implementations unless the purpose of the diagram is to document a technology decision.

---

## Principle

Prefer architectural roles over product names.

---

## Correct

AI Platform

Version Control Platform

Cloud Storage

Relational Database

Object Storage

Message Broker

Desktop Application

Plugin SDK

---

## Avoid

OpenAI

Anthropic

GitHub

GitLab

Dropbox

SQLite

PostgreSQL

Redis

RabbitMQ

Electron

Next.js

React

---

## Exception

Concrete technologies may appear only when:

- documenting an Architecture Decision Record (ADR);
- documenting deployment architecture;
- documenting infrastructure;
- documenting a technology strategy;
- documenting implementation details.

---

## Rationale

Technology changes more frequently than architecture.

Architecture documentation should remain stable even when implementations evolve.

# 22. One Diagram — One Question Rule

Every architectural diagram must answer one primary question.

Examples:

C4 Level 1

Who interacts with the platform?

---

C4 Level 2

How is the platform executed?

---

Component Diagram

How is this subsystem organized?

---

Sequence Diagram

How does this interaction occur?

---

State Diagram

How does this object evolve?

---

Activity Diagram

How is this process executed?

# 23. Diagram Validation Rule

Every PlantUML diagram must compile successfully.

Diagrams that do not compile must never be committed.

Continuous Integration should validate all .puml files.

# 24. Relationship Rule

Relationship labels must describe a business interaction.

Good

Imports knowledge

Indexes documents

Synchronizes workspace

Executes automation

Consumes AI capabilities

Avoid

Uses

Calls

Accesses

Reads

Writes

# 25. Diagram Metadata Standard

Every PlantUML diagram shall include:

- Diagram ID
- Title
- Version
- Status
- Author
- Standard footer

The metadata must appear immediately after the @startuml declaration.

# 26. Convención de IDs

Esto debe quedar escrito porque se reutilizará en UML.

| Prefijo | Significado          | Ejemplo               |
| ------- | -------------------- | --------------------- |
| USR     | User                 | USR                   |
| DEV     | Plugin Developer     | DEV                   |
| KOS     | KnowledgeOS Platform | KOS                   |
| EXT     | External System      | EXT_AI                |
| CNT     | Container            | CNT_DESKTOP           |
| CMP     | Component            | CMP_EVENTBUS          |
| IF      | Interface            | IF_STORAGE            |
| EVT     | Event                | EVT_DOCUMENT_IMPORTED |
| CMD     | Command              | CMD_IMPORT_DOCUMENT   |


# 27. Diagram Metadata Standard

Every PlantUML diagram must include:

- Diagram ID
- Title
- Version
- Status
- Author
- Footer

Example:

@startuml DiagramName

'
' ============================================================================
' Diagram ID : C4-L1
' Title      : System Context
' Version    : 1.0
' Status     : Approved
' Author     : KnowledgeOS Team
' ============================================================================

...

footer
KnowledgeOS Architecture
C4 Model
Version 1.0
endfooter

@enduml
