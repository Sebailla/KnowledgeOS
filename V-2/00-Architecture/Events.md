
# Events — KnowledgeOS Core Observability Layer

Versión: 0.1
Estado: Core Architecture

---

# 1. Propósito

Este documento define el sistema de eventos de KnowledgeOS.

Su objetivo es:

- registrar todo lo que ocurre en el sistema
- permitir trazabilidad completa del conocimiento
- habilitar debugging del pipeline
- reconstruir decisiones pasadas
- observar evolución del Knowledge Graph

---

# 2. Principio fundamental

Todo lo que ocurre en el sistema genera un evento.

Nada es implícito.

---

# 3. Event Model

Cada evento tiene la siguiente estructura:

```text
Event:
  id: unique
  timestamp: ISO-8601
  type: string
  source: module
  target: module/entity
  payload: object
  confidence: float (optional)
  trace_id: string
```

---

# 4. Tipos de eventos

---

## 4.1 Document Events

Relacionados con entrada de documentos:

- DocumentImported
- DocumentParsed
- DocumentRejected
- DocumentUpdated

---

## 4.2 Pipeline Events

Relacionados con el pipeline de importación:

- RDMCreated
- SDMGenerated
- LDMGenerated
- UDMBuilt
- UDMValidated

---

## 4.3 Graph Events

Relacionados con el Knowledge Graph:

- NodeCreated
- NodeUpdated
- EdgeCreated
- EdgeRemoved
- GraphReweighted

---

## 4.4 Memory Events

Relacionados con el usuario:

- MemoryUpdated
- PKGNodeCreated
- BehaviorPatternDetected

---

## 4.5 Search Events

- QueryExecuted
- KEGGenerated
- ResultRanked
- ResultExpanded

---

## 4.6 Synthesis Events

- SynthesisStarted
- EvidenceCollected
- HypothesisGenerated
- ResponseProduced

---

## 4.7 Decision Events

- DecisionEvaluated
- DecisionSelected
- DecisionRejected
- AmbiguityDetected

---

## 4.8 Annotation Events

- HighlightCreated
- NoteAdded
- AnnotationLinked
- AnnotationConvertedToRelation

---

# 5. Trace System

Cada flujo importante genera un:

> trace_id

Esto permite reconstruir cualquier proceso completo:

```text
Import PDF
 → RDM
 → SDM
 → LDM
 → UDM
 → Validation
 → Indexing
```

---

# 6. Event Storage

Los eventos se almacenan en:

- append-only log
- queryable index
- graph-linked event history

---

# 7. Event → Knowledge Graph linkage

Eventos pueden generar nodos en el grafo:

Ejemplo:

- SynthesisEvent → crea evidencia node
- AnnotationEvent → crea semantic relation
- DecisionEvent → crea hypothesis node

---

# 8. Replay System

El sistema puede:

- reconstruir un pipeline completo
- simular decisiones pasadas
- depurar errores de importación
- analizar evolución del grafo

---

# 9. Observability Levels

---

## Level 1 — System

Eventos técnicos básicos

---

## Level 2 — Pipeline

Eventos de procesamiento de documentos

---

## Level 3 — Knowledge

Eventos semánticos del grafo

---

## Level 4 — Cognitive

Eventos de razonamiento y síntesis

---

# 10. Reglas

## R-001

Todo evento debe ser inmutable.

---

## R-002

No se pueden eliminar eventos.

---

## R-003

Todo evento debe tener trazabilidad.

---

## R-004

Los eventos no pueden ser ambiguos.

---

# 11. Objetivo de diseño

Permitir que el sistema sea:

- debugeable
- auditable
- reproducible
- explicable

---

# 12. Principio fundamental

Si algo ocurre en el sistema y no es un evento, entonces no existe para el sistema.
