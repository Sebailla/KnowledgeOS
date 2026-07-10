
# Architecture Principles

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define los principios arquitectónicos obligatorios de KnowledgeOS.

Los principios representan reglas permanentes que deberán respetarse durante toda la evolución del proyecto.

Toda decisión futura deberá alinearse con estos principios o justificarse mediante un ADR.

---

# 2. Principios Fundamentales

## AP-01 — Knowledge Object First

Toda unidad persistente administrada por KnowledgeOS es un Knowledge Object.

Los formatos originales nunca forman parte del modelo interno.

---

## AP-02 — Offline First

El sistema debe funcionar completamente sin conexión.

La conectividad amplía capacidades, pero no constituye un requisito para el funcionamiento normal.

---

## AP-03 — Source of Truth Única

Cada Library posee una única Source of Truth.

Inicialmente será el NAS del usuario.

Las copias locales son únicamente copias de trabajo.

---

## AP-04 — El Original Nunca se Modifica

Los archivos originales permanecen siempre intactos.

KnowledgeOS nunca altera el contenido del archivo importado.

---

## AP-05 — UDM como Modelo Canónico

Todo Knowledge Object posee exactamente un UDM.

El UDM constituye la representación oficial del contenido.

---

## AP-06 — Separación entre Contenido y Presentación

Contenido, Layout, Style, Annotation y Knowledge representan capas independientes.

Ninguna modifica automáticamente a otra.

---

## AP-07 — Knowledge Graph Derivado

El Knowledge Graph nunca constituye la fuente de verdad.

Siempre puede reconstruirse a partir del UDM y de las anotaciones.

---

## AP-08 — Assets Compartidos

Los recursos binarios poseen identidad propia.

Nunca se duplican.

Se reutilizan mediante referencias.

---

## AP-09 — Modular Monolith

El sistema se implementa inicialmente como un Modular Monolith.

Cada módulo puede evolucionar sin afectar a los demás.

---

## AP-10 — Engine Based Architecture

Toda funcionalidad pertenece a un único Engine.

Un Engine posee una única responsabilidad principal.

---

## AP-11 — Contratos Públicos

Los Engines colaboran exclusivamente mediante:

* Commands
* Queries
* Events
* DTOs

Nunca mediante implementaciones internas.

---

## AP-12 — Bajo Acoplamiento

Los módulos conocen únicamente contratos públicos.

Las implementaciones permanecen encapsuladas.

---

## AP-13 — Alta Cohesión

Cada módulo agrupa responsabilidades relacionadas.

No existen módulos multipropósito.

---

## AP-14 — Persistencia Transparente

El dominio no conoce:

* SQLite
* NAS
* archivos
* red
* APIs externas

Toda persistencia pertenece a Infrastructure.

---

## AP-15 — IA Opcional

La inteligencia artificial constituye una capacidad adicional.

KnowledgeOS debe seguir siendo completamente funcional sin IA.

---

## AP-16 — IA Desacoplada

Los modelos de IA son intercambiables.

El sistema nunca depende de un proveedor específico.

---

## AP-17 — Eventos Inmutables

Todo evento representa un hecho ocurrido.

Los eventos nunca se modifican.

---

## AP-18 — Versionado Permanente

Todo elemento persistente puede versionarse.

Las migraciones nunca destruyen información.

---

## AP-19 — Extensibilidad

Toda funcionalidad adicional deberá implementarse mediante Plugins o nuevos Engines.

Nunca modificando el núcleo sin justificación arquitectónica.

---

## AP-20 — Evolución Controlada

Toda modificación arquitectónica deberá aprobarse mediante un Architecture Decision Record.

No se permiten cambios estructurales ad hoc.

---

# 3. Aplicación

Estos principios son obligatorios para:

* diseño;
* implementación;
* pruebas;
* documentación;
* plugins;
* APIs;
* modelos de datos.

---

# 4. Prioridad

Cuando dos principios entren en conflicto, prevalecerán en el siguiente orden:

1. Integridad del conocimiento.
2. Preservación del contenido original.
3. Offline First.
4. Simplicidad del dominio.
5. Extensibilidad.
6. Rendimiento.

---

# 5. Estado

Este documento constituye la referencia oficial de los principios arquitectónicos de KnowledgeOS.

Toda excepción deberá documentarse mediante un ADR.
