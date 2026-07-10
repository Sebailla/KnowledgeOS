
# Architecture Decision Records (ADR)

**Proyecto:** KnowledgeOS

**Documento:** ADR Index

**Versión:** 2.0

**Estado:** Approved

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Documentos relacionados**

* ../ArchitectureModel.md
* ../ArchitectureReview-v2.0.md
* ../ArchitectureVocabulary.md
* ../DocumentationStandards.md

---

# 1. Objetivo

Este documento constituye el índice oficial de los **Architecture Decision Records (ADR)** de KnowledgeOS.

Los ADR registran las decisiones arquitectónicas permanentes que afectan al diseño, implementación y evolución del sistema.

Una vez aceptado un ADR, toda implementación deberá respetarlo.

---

# 2. ¿Qué es un ADR?

Un Architecture Decision Record documenta:

* el problema;
* el contexto;
* la decisión tomada;
* las alternativas consideradas;
* las consecuencias;
* los riesgos;
* los documentos relacionados.

Los ADR representan la memoria arquitectónica del proyecto.

---

# 3. ¿Cuándo crear un ADR?

Debe crearse un ADR cuando una decisión afecte:

* la arquitectura;
* el dominio;
* el formato `.kdoc`;
* el UDM;
* el modelo de sincronización;
* el almacenamiento;
* los Engines;
* los contratos públicos;
* los Plugins;
* la interoperabilidad;
* la evolución futura del sistema.

No deben utilizarse ADR para decisiones de implementación local.

---

# 4. Ciclo de vida

Todo ADR posee uno de los siguientes estados:

| Estado     | Significado                                    |
| ---------- | ---------------------------------------------- |
| Draft      | En elaboración                                |
| Review     | En revisión                                   |
| Accepted   | Aprobado                                       |
| Superseded | Reemplazado por otro ADR                       |
| Deprecated | Obsoleto                                       |
| Archived   | Conservado únicamente por motivos históricos |

---

# 5. Organización

Los ADR se numeran secuencialmente.

La numeración nunca cambia.

Los números nunca se reutilizan.

Un ADR eliminado pasa al estado **Superseded**, **Deprecated** o **Archived**, pero conserva su identificador.

---

# 6. Convenciones

Todos los ADR siguen exactamente la estructura definida en:

```text
DocumentationStandards.md
```

Toda modificación significativa requiere una nueva versión del ADR.

---

# 7. Catálogo oficial

## Arquitectura

| ADR     | Estado   | Impacto |
| ------- | -------- | ------- |
| ADR-001 | Accepted | Core    |
| ADR-005 | Accepted | Core    |
| ADR-011 | Accepted | Core    |
| ADR-012 | Accepted | Core    |
| ADR-014 | Accepted | Core    |

---

## Dominio

| ADR     | Estado   | Impacto |
| ------- | -------- | ------- |
| ADR-002 | Accepted | Core    |
| ADR-010 | Accepted | Core    |
| ADR-013 | Accepted | Core    |
| ADR-015 | Accepted | Core    |

---

## Plataforma

| ADR     | Estado   | Impacto |
| ------- | -------- | ------- |
| ADR-003 | Accepted | Core    |
| ADR-007 | Accepted | High    |

---

## Storage

| ADR     | Estado   | Impacto |
| ------- | -------- | ------- |
| ADR-004 | Accepted | Core    |
| ADR-008 | Accepted | Core    |
| ADR-009 | Accepted | Core    |

---

## Artificial Intelligence

| ADR     | Estado   | Impacto |
| ------- | -------- | ------- |
| ADR-006 | Accepted | High    |

---

# 8. Índice completo

| ADR     | Título                       | Área        | Estado   |
| ------- | ----------------------------- | ------------ | -------- |
| ADR-001 | Architectural Style           | Architecture | Accepted |
| ADR-002 | Universal Document Model      | Domain       | Accepted |
| ADR-003 | Offline First                 | Platform     | Accepted |
| ADR-004 | Library Source of Truth       | Storage      | Accepted |
| ADR-005 | Engine Based Architecture     | Architecture | Accepted |
| ADR-006 | AI Architecture               | AI           | Accepted |
| ADR-007 | Plugin Architecture           | Platform     | Accepted |
| ADR-008 | Storage Architecture          | Storage      | Accepted |
| ADR-009 | Synchronization Strategy      | Storage      | Accepted |
| ADR-010 | Knowledge Object Identity     | Domain       | Accepted |
| ADR-011 | Event Architecture            | Architecture | Accepted |
| ADR-012 | Public Contracts              | Architecture | Accepted |
| ADR-013 | Knowledge Object Architecture | Domain       | Accepted |
| ADR-014 | Workflow Engine               | Architecture | Accepted |
| ADR-015 | Global Identity Model         | Domain       | Accepted |

---

# 9. Dependencias

```text
ADR-001
│
├── ADR-002
├── ADR-003
├── ADR-004
├── ADR-005
│      │
│      ├── ADR-006
│      ├── ADR-007
│      ├── ADR-011
│      ├── ADR-012
│      └── ADR-014
│
├── ADR-008
│      └── ADR-009
│
├── ADR-010
│      └── ADR-015
│
└── ADR-013
```

Este diagrama representa únicamente dependencias conceptuales.

No implica dependencias de implementación.

---

# 10. Relación con la documentación

Los ADR complementan, pero no reemplazan:

* ProductVision.md
* ArchitectureModel.md
* DomainModel.md
* KnowledgeLifecycle.md
* EngineResponsibilities.md
* ArchitecturePrinciples.md
* ArchitectureConstraints.md
* QualityAttributes.md

Estos documentos describen la arquitectura.

Los ADR explican por qué se tomaron determinadas decisiones.

---

# 11. Relación con las especificaciones

Las especificaciones de `01-Specifications` deberán respetar todos los ADR aceptados.

Si una especificación entra en conflicto con un ADR:

* prevalece el ADR;
* la especificación deberá modificarse;
* o deberá proponerse un nuevo ADR.

---

# 12. Relación con la implementación

Toda implementación deberá poder responder:

* ¿Qué ADR justifica esta decisión?
* ¿Qué ADR limita este diseño?
* ¿Qué ADR afecta esta modificación?

Si no existe un ADR para una decisión arquitectónica relevante, deberá crearse uno antes de implementar.

---

# 13. Buenas prácticas

* Mantener los ADR pequeños y enfocados.
* No mezclar varias decisiones independientes en un mismo ADR.
* Referenciar siempre los documentos relacionados.
* Actualizar el índice cuando se incorpore un nuevo ADR.
* No modificar retrospectivamente decisiones aceptadas; crear un nuevo ADR cuando sea necesario.

---

# 14. Estado

Este documento constituye el índice oficial y la guía de uso de los Architecture Decision Records de KnowledgeOS.
