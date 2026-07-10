
# Documentation Standards

**Proyecto:** KnowledgeOS

**Documento:** Documentation Standards

**Versión:** 2.0

**Estado:** Approved

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Documentos relacionados**

* ArchitectureVocabulary.md
* ProductVision.md
* ArchitectureModel.md
* ArchitectureReview-v2.0.md
* ADR/README.md

---

# 1. Objetivo

Este documento define el estándar oficial para toda la documentación técnica de KnowledgeOS.

Su propósito es garantizar:

* consistencia;
* legibilidad;
* mantenibilidad;
* navegabilidad;
* versionado uniforme;
* independencia del autor.

Toda documentación futura deberá cumplir este estándar.

---

# 2. Alcance

Aplica a:

* Architecture
* ADR
* Specifications
* Contracts
* Public API
* UML
* C4
* RFC futuras
* documentación de desarrollo
* documentación de Plugins

No existen excepciones.

---

# 3. Idioma

La documentación oficial utilizará:

## Idioma técnico

**Inglés**

Ejemplos:

* Knowledge Object
* Workflow
* Event
* Repository
* Engine
* Provider
* Collection

## Texto explicativo

Puede escribirse inicialmente en español durante la fase de diseño.

Antes de una versión pública deberá traducirse completamente al inglés.

Los nombres de conceptos nunca se traducen.

---

# 4. Naming

Los nombres utilizan PascalCase.

Ejemplos:

```text
KnowledgeObject
WorkflowEngine
AssetRepository
ImportPipeline
```

Los documentos utilizan:

```text
KnowledgeLifecycle.md

ArchitectureModel.md

DocumentationStandards.md
```

No utilizar:

```text
knowledge_lifecycle.md

knowledge-lifecycle.md
```

---

# 5. Encabezado obligatorio

Todo documento comienza con:

```text
# Title

Project

Version

Status

Author

Last Updated

Related Documents
```

En ese orden.

---

# 6. Versionado

Formato:

```text
Major.Minor
```

Ejemplos

```text
1.0

2.0

2.1
```

No utilizar:

```text
Final

Latest

Current
```

---

# 7. Estados permitidos

Todo documento posee exactamente uno.

```text
Draft

Review

Approved

Deprecated

Archived
```

---

# 8. Estructura

Todo documento técnico seguirá:

```text
1 Purpose

2 Scope

3 Definitions

4 Description

5 Decisions

6 Consequences

7 References
```

Los ADR utilizan su propia estructura.

---

# 9. Referencias

Las referencias siempre son relativas.

Ejemplo

```text
../ADR/ADR-005-Engine-Based-Architecture.md
```

Nunca rutas absolutas.

---

# 10. Diagramas

Los diagramas oficiales son únicamente:

* PlantUML
* C4-PlantUML

No se utilizarán:

* Mermaid
* Draw.io
* Visio

como fuente oficial.

---

# 11. Organización de diagramas

Todos los diagramas poseen:

```text
.puml
```

Como fuente.

Las imágenes SVG y PNG son derivados.

Nunca se editan manualmente.

---

# 12. UML

Cada tipo posee su carpeta.

```text
Activity

Class

Component

Deployment

Sequence

State
```

No mezclar diagramas.

---

# 13. C4

La estructura oficial será:

```text
Level 1

System Context

Level 2

Containers

Level 3

Components

Level 4

Code
```

Los diagramas C4 utilizan exclusivamente la librería local incluida en el repositorio.

---

# 14. Markdown

Todos los documentos utilizan:

* un único H1;
* H2 para secciones;
* H3 cuando sea necesario.

Nunca saltar niveles.

---

# 15. Tablas

Las tablas se utilizan únicamente cuando aportan claridad.

No deben sustituir texto explicativo.

---

# 16. Código

Todo fragmento de código especifica el lenguaje.

Ejemplo

````text
```swift
```
````

No utilizar bloques sin identificar.

---

# 17. Diagramas ASCII

Se permiten únicamente para representar conceptos simples.

Nunca sustituyen diagramas oficiales.

---

# 18. Terminología

Toda la terminología deberá coincidir exactamente con:

ArchitectureVocabulary.md

No se permiten sinónimos.

Ejemplo

Correcto:

Knowledge Object

Incorrecto:

Document

File

Record

---

# 19. ADR

Todos los ADR utilizarán exactamente la siguiente estructura:

```text
1 Context

2 Decision

3 Motivation

4 Detailed Design

5 Alternatives

6 Consequences

7 Trade-offs

8 Risks

9 Related Documents

10 Related ADR

11 Status
```

No se modificará el orden.

---

# 20. Referencias cruzadas

Todo documento deberá incluir una sección:

```text
Related Documents
```

Todo ADR incluirá además:

```text
Related ADR
```

---

# 21. Convenciones para repositorios

Repository representa un concepto lógico.

Nunca una carpeta física.

Ejemplos:

Object Repository

Asset Repository

Index Repository

Journal Repository

---

# 22. Convenciones para Engines

Todo Engine:

* posee una única responsabilidad;
* posee una API pública;
* publica eventos;
* consume Commands, Queries o Events;
* nunca accede directamente a implementaciones internas de otro Engine.

---

# 23. Convenciones para identidades

Toda identidad se representa mediante:

```text
KnowledgeObjectID

AssetID

WorkflowID

NodeID
```

Nunca utilizar:

```text
id

identifier

key
```

como nombre genérico.

---

# 24. Convenciones para eventos

Todo evento:

* representa un hecho pasado;
* utiliza tiempo pasado;
* es inmutable.

Ejemplos:

KnowledgeObjectCreated

ImportCompleted

WorkflowStarted

Nunca:

CreateKnowledgeObject

---

# 25. Convenciones para Commands

Todo Command representa una intención.

Ejemplos:

CreateKnowledgeObject

DeleteAnnotation

ImportKnowledgeObject

---

# 26. Convenciones para Queries

Toda Query representa una consulta.

Ejemplos:

GetKnowledgeObject

FindAnnotations

SearchLibrary

---

# 27. Convenciones para Providers

Todo proveedor implementa un contrato.

Ejemplos:

OpenAIProvider

OllamaProvider

TesseractProvider

Nunca aparecen en el dominio.

---

# 28. Convenciones para Plugins

Todo Plugin declara:

* PluginID;
* Version;
* Permissions;
* Compatibility.

---

# 29. Documentos obligatorios

Toda nueva funcionalidad significativa deberá contar, como mínimo, con:

* ADR (si modifica decisiones arquitectónicas).
* Specification.
* Contracts.
* Diagramas C4 o UML cuando corresponda.
* Actualización del vocabulario si incorpora nuevos conceptos.

---

# 30. Control de calidad

Antes de aprobar un documento deberá verificarse:

* formato correcto;
* terminología oficial;
* referencias válidas;
* diagramas actualizados;
* consistencia con el resto de la arquitectura;
* ausencia de duplicación conceptual.

---

# 31. Estado

Este documento define el estándar oficial de documentación para KnowledgeOS.

Toda documentación futura deberá cumplir estas normas antes de considerarse aprobada.
