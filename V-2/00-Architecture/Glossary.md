
# Glossary — KnowledgeOS Core Terms

Versión: 0.1
Estado: Core Architecture

---

# 1. Propósito

Este documento define la terminología oficial del sistema KnowledgeOS.

Su objetivo es:

- eliminar ambigüedad conceptual
- mantener consistencia entre módulos
- estandarizar lenguaje de arquitectura
- servir como referencia única

---

# 2. Modelos de Documento

---

## RDM — Raw Document Model

Representación de datos crudos extraídos del archivo original.

Incluye:

- texto sin procesar
- bounding boxes
- imágenes
- tablas
- posiciones

👉 Es lo que *existe físicamente*.

---

## SDM — Structured Document Model

Representación lógica del documento.

Incluye:

- jerarquía
- secciones
- capítulos
- orden de lectura

👉 Es lo que *el documento significa estructuralmente*.

---

## LDM — Layout Document Model

Representación visual del documento.

Incluye:

- columnas
- tipografía
- espaciado
- layout editorial

👉 Es lo que *el documento parece*.

---

## UDM — Universal Document Model

Representación unificada de conocimiento.

Incluye:

- objetos
- relaciones
- anotaciones
- trazabilidad completa

👉 Es lo que *el documento es como conocimiento*.

---

# 3. Knowledge Graph

---

## Knowledge Graph (KG)

Red global de conocimiento del sistema.

Compuesto por:

- nodos (objetos UDM)
- edges (relaciones semánticas)

---

## KEG — Knowledge Exploration Graph

Subgrafo dinámico generado por una consulta.

👉 Es una “vista temporal” del Knowledge Graph.

---

## PKG — Personal Knowledge Graph

Subgrafo privado del usuario.

Incluye:

- intereses
- patrones
- rutas frecuentes
- conocimiento reforzado

---

# 4. System Layers

---

## Capability

Módulo funcional del sistema.

Ejemplo:

- Import
- Search
- Synthesis
- Annotation

---

## Operation

Unidad de ejecución dentro de una Capability.

Ejemplo:

- Parse PDF
- Build UDM
- Validate Graph

---

## Orchestrator

Coordinador de ejecución de Capabilities y Operations.

No ejecuta lógica.

---

## Manager

Encargado de una entidad específica del sistema.

Ejemplo:

- Graph Manager
- Memory Manager
- Document Manager

---

## Repository

Capa de persistencia de datos.

---

# 5. Intelligence Layers

---

## Graph Intelligence

Sistema de evolución del Knowledge Graph.

---

## Memory Layer

Sistema de memoria del usuario.

---

## Synthesis Engine

Sistema de razonamiento sobre conocimiento.

---

# 6. Document State

---

## Active

Documento disponible en el sistema.

---

## Indexed

Documento incorporado al Knowledge Graph.

---

## Deprecated

Documento reemplazado por versión más nueva.

---

## Superseded

Documento reemplazado completamente.

---

# 7. Annotation System

---

## Highlight

Marcado visual de contenido.

---

## Sticky Note

Nota flotante asociada a contenido.

---

## Semantic Annotation

Anotación con significado dentro del grafo.

---

# 8. Decision System

---

## Decision

Selección entre múltiples opciones basada en evidencia.

---

## Confidence Score

Nivel de certeza de una decisión.

---

## Hypothesis

Opción válida no confirmada.

---

# 9. Core Principles

---

## Evidence-based System

Todo debe basarse en evidencia rastreable.

---

## No implicit logic

Nada ocurre sin definición explícita.

---

## Uncertainty visibility

La incertidumbre siempre es visible.

---

## Traceability

Todo debe poder rastrearse a su origen.

---

# 10. Principio fundamental

El lenguaje del sistema es parte de la arquitectura.

Si los términos cambian, el sistema cambia.
