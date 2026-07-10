# Architecture Review v2.0

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Approved

**Fecha:** *(Completar al aprobar la revisión)*

---

# 1. Objetivo

Este documento registra la revisión arquitectónica realizada antes del inicio de la implementación del núcleo de KnowledgeOS.

Su propósito es:

* consolidar las decisiones arquitectónicas;
* verificar la consistencia del dominio;
* congelar la arquitectura base;
* establecer las reglas para futuras modificaciones.

A partir de esta versión, la arquitectura se considera estable.

---

# 2. Alcance de la revisión

Se revisaron los siguientes documentos:

* ProductVision.md
* ArchitectureModel.md
* DomainModel.md
* KnowledgeLifecycle.md
* EngineResponsibilities.md
* ArchitecturePrinciples.md
* ArchitectureConstraints.md
* QualityAttributes.md

Además se revisaron:

* ADR
* UDM
* Contracts
* Public APIs
* C4
* UML
* Storage
* Especificaciones iniciales

---

# 3. Objetivos alcanzados

Durante la revisión se logró:

* unificar el vocabulario del dominio;
* eliminar inconsistencias conceptuales;
* definir una única representación persistente;
* separar claramente contenido, conocimiento y presentación;
* consolidar la arquitectura basada en Engines;
* establecer una estrategia de evolución mediante ADR.

---

# 4. Cambios principales respecto a v1.0

## Cambio 1

El concepto central deja de ser **Document**.

Ahora el concepto central es:

**Knowledge Object**

---

## Cambio 2

Se introduce el formato nativo:

`.kdoc`

---

## Cambio 3

Se redefine el rol del UDM.

Antes:

El UDM representaba el documento completo.

Ahora:

El UDM representa únicamente el contenido estructurado.

---

## Cambio 4

Se formaliza el Knowledge Graph.

Ahora constituye un modelo derivado e independiente.

---

## Cambio 5

Los Assets pasan a ser entidades externas compartidas.

---

## Cambio 6

Se formaliza la Engine Based Architecture.

---

## Cambio 7

Se consolida el modelo Offline First.

---

## Cambio 8

Se adopta definitivamente el NAS como Source of Truth inicial.

---

# 5. Modelo Arquitectónico Congelado

```text
Knowledge Object

↓

.kdoc

↓

UDM

↓

Knowledge Graph

↓

Render

↓

Search

↓

AI

↓

Export
```

Este flujo constituye la arquitectura oficial de KnowledgeOS.

---

# 6. Conceptos Fundamentales

La arquitectura queda basada en los siguientes conceptos:

* Library
* Knowledge Object
* UDM
* Knowledge Graph
* Assets
* Collections
* Workspaces
* Engines
* Contracts
* Plugins

No existen conceptos persistentes adicionales.

---

# 7. Motores Oficiales

La implementación inicial contempla los siguientes Engines:

* Kernel
* Library
* Import
* Render
* Search
* Annotation
* Knowledge
* AI
* Sync
* Export
* Plugin

Cada Engine posee una única responsabilidad principal.

---

# 8. Principios ratificados

Se ratifican los siguientes principios:

* Offline First
* Knowledge Object First
* Engine Based Architecture
* Modular Monolith
* Source of Truth única
* Contratos públicos
* Bajo acoplamiento
* Alta cohesión
* IA opcional
* Evolución mediante ADR

---

# 9. Restricciones ratificadas

Se mantienen como obligatorias:

* dominio independiente de infraestructura;
* UDM como representación canónica del contenido;
* Knowledge Graph derivado;
* Assets externos;
* originales inmutables;
* transacciones para persistencia;
* comunicación mediante Commands, Queries y Events.

---

# 10. Riesgos identificados

Se identifican los siguientes riesgos técnicos:

## Importación

La reconstrucción precisa del Layout puede variar entre formatos.

Mitigación:

* Pipeline modular.
* Validación.
* Confidence Model.

---

## OCR

La calidad depende del documento original.

Mitigación:

* múltiples motores;
* revisión manual;
* puntuación de confianza.

---

## Sincronización

Posibles conflictos de edición.

Mitigación:

* Journal;
* versionado;
* resolución explícita.

---

## IA

Resultados no deterministas.

Mitigación:

* proveedores intercambiables;
* trazabilidad;
* separación del contenido canónico.

---

# 11. Riesgos aceptados

Se acepta que:

* la representación visual nunca será idéntica en todos los formatos;
* la IA puede producir resultados imperfectos;
* algunos formatos requerirán importadores específicos;
* la sincronización distribuida incrementa la complejidad.

Estos riesgos forman parte del alcance del proyecto.

---

# 12. Decisiones congeladas

Quedan congeladas las siguientes decisiones:

1. Knowledge Object como unidad persistente.
2. `.kdoc` como formato nativo.
3. SQLite como implementación del `.kdoc`.
4. UDM como modelo canónico del contenido.
5. Knowledge Graph como modelo derivado.
6. Assets externos.
7. Offline First.
8. NAS como Source of Truth inicial.
9. Modular Monolith.
10. Engine Based Architecture.
11. Commands, Queries y Events como mecanismo de comunicación.
12. Plugins mediante contratos públicos.

Estas decisiones no deberán modificarse durante la implementación.

---

# 13. Reglas para futuras modificaciones

Una modificación arquitectónica requerirá un ADR cuando afecte:

* el dominio;
* el formato `.kdoc`;
* el UDM;
* el Knowledge Graph;
* el Storage;
* el modelo de sincronización;
* los contratos públicos;
* la estructura de Engines.

Las optimizaciones internas no requieren ADR mientras respeten la arquitectura aprobada.

---

# 14. Criterios para iniciar la implementación

La implementación podrá comenzar cuando:

* la arquitectura se encuentre aprobada;
* los ADR fundamentales estén completos;
* el UDM esté congelado;
* los contratos públicos estén definidos;
* el modelo C4 represente fielmente la arquitectura;
* exista una estrategia de pruebas para el Kernel.

---

# 15. Estado de la arquitectura

Resultado de la revisión:

| Área                        | Estado            |
| ---------------------------- | ----------------- |
| Visión del producto         | ✅ Aprobada       |
| Modelo arquitectónico       | ✅ Aprobado       |
| Modelo de dominio            | ✅ Aprobado       |
| Ciclo de vida                | ✅ Aprobado       |
| Responsabilidades de Engines | ✅ Aprobadas      |
| Principios                   | ✅ Aprobados      |
| Restricciones                | ✅ Aprobadas      |
| Calidad                      | ✅ Aprobada       |
| UDM                          | ✅ Congelado v1.0 |
| Arquitectura general         | ✅ Congelada v2.0 |

---

# 16. Próxima etapa

Con la arquitectura congelada, el proyecto entra en la fase de diseño detallado e implementación.

El siguiente bloque de trabajo será:

* Contracts
* Public APIs
* C4
* UML
* Kernel
* Engines

La arquitectura definida en esta revisión constituye la referencia oficial para todas las etapas posteriores.

---

# 17. Aprobación

La versión **2.0** de la arquitectura de KnowledgeOS queda oficialmente aprobada y congelada.

Toda evolución futura deberá preservar los principios establecidos en este documento o justificarse mediante un nuevo Architecture Decision Record.
