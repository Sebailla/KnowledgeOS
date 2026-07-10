
# Architecture Vocabulary

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define el vocabulario oficial utilizado por KnowledgeOS.

Todo documento, diagrama, contrato, API, comentario de código y documentación técnica deberá utilizar estas definiciones.

El objetivo es garantizar un lenguaje único en todo el proyecto.

Cuando un término aparezca en varios documentos, siempre tendrá exactamente el mismo significado.

---

# 2. Reglas

* Un concepto posee una única definición oficial.
* Un término no puede representar dos conceptos distintos.
* No se utilizarán sinónimos dentro de la documentación técnica.
* Las modificaciones deberán aprobarse mediante ADR.

---

# 3. Conceptos Fundamentales

## Knowledge Object

Unidad persistente fundamental administrada por KnowledgeOS.

Representa cualquier unidad autónoma de conocimiento.

Ejemplos:

* libro;
* paper;
* nota;
* conversación;
* página web;
* manual;
* correo electrónico.

Todo Knowledge Object se almacena como un archivo `.kdoc`.

---

## Library

Conjunto completo de Knowledge Objects administrados por el usuario.

La Library constituye la raíz del dominio.

---

## Source of Truth

Ubicación canónica donde reside la versión oficial de una Library.

Inicialmente será el NAS del usuario.

---

## Collection

Agrupación lógica de Knowledge Objects.

No modifica su contenido.

---

## Workspace

Espacio de trabajo personalizado que organiza Collections, búsquedas, filtros y vistas.

---

# 4. Persistencia

## `.kdoc`

Formato persistente oficial de un Knowledge Object.

Internamente utiliza SQLite.

---

## Asset

Recurso binario independiente asociado a uno o más Knowledge Objects.

Ejemplos:

* imagen;
* audio;
* vídeo;
* SVG;
* dataset.

---

## Object Repository

Repositorio lógico responsable de almacenar Knowledge Objects.

---

## Asset Repository

Repositorio lógico responsable de almacenar Assets.

---

## Index Repository

Repositorio lógico responsable de almacenar índices reconstruibles.

---

## Journal Repository

Repositorio lógico responsable de registrar operaciones persistentes para recuperación y auditoría.

---

# 5. Contenido

## Universal Document Model (UDM)

Representación canónica del contenido estructurado de un Knowledge Object.

El UDM no representa el objeto persistente completo.

---

## UDM Node

Unidad estructural identificable dentro del UDM.

---

## Layout

Representación de la disposición física del contenido original.

---

## Style

Representación de las propiedades visuales del contenido.

---

## Metadata

Información descriptiva del Knowledge Object.

---

## Provenance

Información sobre el origen y el procesamiento del Knowledge Object.

---

## History

Registro de la evolución del Knowledge Object.

---

# 6. Conocimiento

## Knowledge Graph

Modelo derivado que representa relaciones entre objetos, nodos, entidades y conceptos.

Nunca constituye la fuente de verdad.

---

## Entity

Concepto identificado dentro del contenido.

Ejemplos:

* persona;
* institución;
* especie;
* medicamento.

---

## Concept

Idea o tema representado dentro del Knowledge Graph.

---

## Relationship

Vínculo entre dos nodos del Knowledge Graph.

---

## Embedding

Representación vectorial utilizada para búsqueda semántica y recuperación de conocimiento.

---

# 7. Anotaciones

## Annotation

Información agregada por el usuario sin modificar el contenido canónico.

---

## Highlight

Resaltado de contenido.

---

## Sticky Note

Nota visual asociada mediante un Anchor.

---

## Ink

Trazo manuscrito realizado por el usuario.

---

## Bookmark

Marcador permanente dentro de un Knowledge Object.

---

## Anchor

Referencia estable utilizada para vincular anotaciones y relaciones con el contenido del UDM.

---

# 8. Arquitectura

## Engine

Módulo funcional con una única responsabilidad principal.

---

## Kernel

Conjunto de servicios comunes utilizados por todos los Engines.

---

## Workflow

Proceso compuesto por múltiples pasos coordinados.

---

## Job

Unidad individual de ejecución dentro de un Workflow.

---

## Command

Solicitud para modificar el estado del sistema.

---

## Query

Solicitud de información sin modificar el estado.

---

## Event

Hecho ocurrido dentro del sistema.

Los eventos son inmutables.

---

## Contract

Acuerdo público entre módulos.

---

## Public API

Interfaz oficial ofrecida por un Engine.

---

## Plugin

Extensión que agrega funcionalidades mediante contratos públicos.

---

## Provider

Implementación concreta de un servicio externo.

Ejemplos:

* proveedor IA;
* proveedor OCR;
* proveedor de sincronización.

---

# 9. Identidad

## Identity

Identificador permanente e inmutable de un objeto.

---

## Content Hash

Hash calculado sobre el contenido.

Se utiliza para verificar integridad y detectar duplicados.

Nunca reemplaza a la identidad.

---

## Version

Estado específico de un objeto en un momento determinado.

---

## Checksum

Valor utilizado para verificar la integridad de un recurso persistente.

---

## Correlation ID

Identificador utilizado para relacionar eventos, Jobs y Workflows pertenecientes a una misma operación.

---

# 10. Reglas de Terminología

A partir de la versión 2.0 queda prohibido utilizar en la documentación técnica:

* Document (cuando el concepto correcto sea Knowledge Object).
* File (cuando corresponda Knowledge Object).
* Folder (cuando corresponda Repository).
* Background Task (cuando corresponda Job).
* Process (cuando corresponda Workflow).

Cuando un documento heredado utilice esta terminología deberá actualizarse.

---

# 11. Estado

Este documento constituye el vocabulario oficial de KnowledgeOS.

Toda la documentación futura deberá utilizar exclusivamente los términos aquí definidos.
