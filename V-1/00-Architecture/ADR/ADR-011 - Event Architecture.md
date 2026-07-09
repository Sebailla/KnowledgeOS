
# ADR-011 - Event Architecture

**Estado:** Accepted

---

# Contexto

KnowledgeOS está compuesto por múltiples Engines independientes.

La comunicación directa entre ellos incrementa el acoplamiento y dificulta la evolución del sistema.

Se requiere un mecanismo que permita coordinar acciones sin crear dependencias innecesarias.

---

# Decisión

La comunicación entre Engines se basa en tres mecanismos claramente diferenciados:

- Commands
- Queries
- Domain Events

Cada mecanismo posee una responsabilidad específica.

---

# Commands

Representan solicitudes de cambio.

Características:

- un único receptor
- modifican estado
- respuesta opcional

Ejemplos:

- ImportDocument
- CreateAnnotation
- DeleteBookmark
- RebuildIndex

---

# Queries

Representan consultas.

Características:

- no modifican estado
- pueden ejecutarse repetidamente
- producen resultados deterministas

Ejemplos:

- GetDocument
- SearchDocuments
- GetAnnotations
- ListWorkspaces

---

# Domain Events

Representan hechos ocurridos dentro del dominio.

Características:

- inmutables
- describen algo que ya ocurrió
- pueden tener múltiples consumidores

Ejemplos:

- DocumentImported
- AnnotationCreated
- DocumentIndexed
- LayoutGenerated
- LibraryOpened

---

# Reglas

Los Events nunca modifican estado.

Los Events únicamente notifican hechos.

---

# Flujo

Command

↓

Engine

↓

Cambio de estado

↓

Domain Event

↓

Otros Engines

---

# Responsabilidades

Cada Engine:

- publica Events
- consume Events
- expone Commands
- responde Queries

---

# Consecuencias

## Positivas

- Bajo acoplamiento.
- Mayor extensibilidad.
- Mejor observabilidad.
- Facilidad para incorporar Plugins.

## Negativas

- Mayor número de mensajes.
- Necesidad de trazabilidad.

---

# Alternativas consideradas

Llamadas directas entre Engines.

Descartadas por generar alto acoplamiento.

---

# Decisiones congeladas

1. Los Commands modifican estado.
2. Las Queries nunca modifican estado.
3. Los Events representan hechos consumados.
4. Los Engines se coordinan mediante Events.
5. Los Events son inmutables.
