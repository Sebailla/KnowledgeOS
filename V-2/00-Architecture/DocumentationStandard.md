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
