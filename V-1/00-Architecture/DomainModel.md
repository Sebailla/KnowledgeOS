

# DomainModel.md

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Definir el modelo conceptual del dominio.

Este documento establece el lenguaje ubicuo de KnowledgeOS.

Todos los componentes, APIs, bases de datos, diagramas y código utilizarán esta terminología.

---

# Principios

## El dominio es independiente de la implementación

Las entidades representan conceptos del negocio.

No representan tablas.

No representan clases.

No representan archivos.

---

## Identidad permanente

Toda entidad persistente posee un UUID.

La identidad nunca depende del almacenamiento.

---

## Relaciones explícitas

Las relaciones forman parte del dominio.

Nunca se infieren mediante la interfaz.

---

# Agregados del dominio

KnowledgeOS se organiza mediante los siguientes agregados.

```

Knowledge Space
│
├── Library
├── Workspace
├── Document
├── Asset
├── Annotation
├── Collection
├── Tag
├── Search
└── Plugin
```



# Library

## Definición

La Library representa una biblioteca completa de conocimiento.

Es el agregado raíz del sistema.

---

## Responsabilidades

* administrar documentos
* administrar assets
* administrar metadatos
* administrar colecciones
* administrar workspaces

---

## Identidad

* UUID

---

## Relaciones

Contiene:

* Documents
* Assets
* Workspaces
* Collections

---

# Workspace

## Definición

Vista lógica de una Library.

No almacena conocimiento.

Organiza conocimiento.

---

## Puede contener

* carpetas virtuales
* filtros
* búsquedas
* colecciones

---

# Collection

Agrupación lógica de documentos.

No modifica documentos.

Puede ser:

* manual
* dinámica

---

# Document

## Definición

Unidad principal de conocimiento.

Representa un documento importado.

---

## Identidad

* UUID

---

## Estado

Un documento posee:

* Original
* UDM
* Metadata
* Assets
* Layout

---

## Relaciones

Pertenece a:

* una Library

Puede aparecer en:

* múltiples Collections
* múltiples Workspaces

Posee:

* Annotation
* Assets

---

# Original Document

Representa el archivo importado.

Características:

* solo lectura
* inmutable
* referencia permanente

No forma parte del UDM.

---

# UDM Document

Representación canónica del conocimiento.

Está compuesto por nodos.

---

# UDM Node

Unidad básica del conocimiento.

Ejemplos:

* Heading
* Paragraph
* List
* Table
* Figure
* Formula
* Quote
* Code
* Footnote

---

## Relaciones

Un nodo puede contener otros nodos.

Forma un árbol.

---

# Asset

Representa un recurso asociado.

Ejemplos:

* imagen
* vídeo
* audio
* miniatura
* OCR
* PDF original

---

# Metadata

Información descriptiva.

Ejemplos:

* título
* autores
* idioma
* etiquetas
* fechas
* hash

---

# Annotation

Representa una interacción del usuario.

Nunca modifica el documento.

---

## Tipos

* Highlight
* Ink
* Bookmark
* Sticky Note
* Text Note

---

## Relaciones

Toda Annotation pertenece a:

* un Document

y

* un UDM Node

Nunca a una página.

---

# Highlight

Representa texto resaltado.

Posee:

* color
* transparencia
* rango

---

# Ink

Representa escritura manuscrita.

---

# Sticky Note

Nota visual.

Puede contener:

* texto
* dibujo

---

# Bookmark

Marca una posición del conocimiento.

---

# Tag

Etiqueta reutilizable.

Puede asociarse a:

* Documents
* Collections
* Annotations

---

# Search Query

Representa una búsqueda realizada por el usuario.

Puede almacenarse.

Puede reutilizarse.

---

# Search Result

Resultado de una consulta.

Siempre referencia objetos del dominio.

Nunca texto plano.

---

# Plugin

Extensión del sistema.

Tipos:

* Importer
* Exporter
* Renderer
* OCR
* AI
* Tool

---

# Relaciones principales

<pre class="overflow-visible! px-0!" data-start="4185" data-end="4375"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼd ͼr"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>
Library

├── Workspace

├── Collection

├── Document

│ ├── Original Document

│ ├── UDM

│ │ └── UDM Node

│ ├── Metadata

│ ├── Layout

│ ├── Assets

│ └── Annotation

└── Plugin
</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

---

# Cardinalidades

Una Library

→ contiene muchos Documents.

Un Document

→ posee un único Original Document.

Un Document

→ posee un único UDM.

Un UDM

→ contiene muchos UDM Nodes.

Un Document

→ posee muchas Annotation.

Una Annotation

→ referencia un único UDM Node.

Un Document

→ posee muchos Assets.

Una Collection

→ contiene muchos Documents.

Un Document

→ puede pertenecer a muchas Collections.

---

# Invariantes del dominio

## Library

Existe una única Source of Truth.

---

## Document

Nunca pierde su identidad.

---

## Original Document

Nunca se modifica.

---

## UDM

Siempre representa el conocimiento vigente.

---

## Annotation

Nunca modifica el UDM.

---

## Layout

Puede regenerarse.

---

## Search Index

Puede regenerarse.

---

## Cache

Nunca contiene información única.

# Library

## Definición

La Library representa una biblioteca completa de conocimiento.

Es el agregado raíz del sistema.

---

## Responsabilidades

* administrar documentos
* administrar assets
* administrar metadatos
* administrar colecciones
* administrar workspaces

---

## Identidad

* UUID

---

## Relaciones

Contiene:

* Documents
* Assets
* Workspaces
* Collections

---

# Workspace

## Definición

Vista lógica de una Library.

No almacena conocimiento.

Organiza conocimiento.

---

## Puede contener

* carpetas virtuales
* filtros
* búsquedas
* colecciones

---

# Collection

Agrupación lógica de documentos.

No modifica documentos.

Puede ser:

* manual
* dinámica

---

# Document

## Definición

Unidad principal de conocimiento.

Representa un documento importado.

---

## Identidad

* UUID

---

## Estado

Un documento posee:

* Original
* UDM
* Metadata
* Assets
* Layout

---

## Relaciones

Pertenece a:

* una Library

Puede aparecer en:

* múltiples Collections
* múltiples Workspaces

Posee:

* Annotation
* Assets

---

# Original Document

Representa el archivo importado.

Características:

* solo lectura
* inmutable
* referencia permanente

No forma parte del UDM.

---

# UDM Document

Representación canónica del conocimiento.

Está compuesto por nodos.

---

# UDM Node

Unidad básica del conocimiento.

Ejemplos:

* Heading
* Paragraph
* List
* Table
* Figure
* Formula
* Quote
* Code
* Footnote

---

## Relaciones

Un nodo puede contener otros nodos.

Forma un árbol.

---

# Asset

Representa un recurso asociado.

Ejemplos:

* imagen
* vídeo
* audio
* miniatura
* OCR
* PDF original

---

# Metadata

Información descriptiva.

Ejemplos:

* título
* autores
* idioma
* etiquetas
* fechas
* hash

---

# Annotation

Representa una interacción del usuario.

Nunca modifica el documento.

---

## Tipos

* Highlight
* Ink
* Bookmark
* Sticky Note
* Text Note

---

## Relaciones

Toda Annotation pertenece a:

* un Document

y

* un UDM Node

Nunca a una página.

---

# Highlight

Representa texto resaltado.

Posee:

* color
* transparencia
* rango

---

# Ink

Representa escritura manuscrita.

---

# Sticky Note

Nota visual.

Puede contener:

* texto
* dibujo

---

# Bookmark

Marca una posición del conocimiento.

---

# Tag

Etiqueta reutilizable.

Puede asociarse a:

* Documents
* Collections
* Annotations

---

# Search Query

Representa una búsqueda realizada por el usuario.

Puede almacenarse.

Puede reutilizarse.

---

# Search Result

Resultado de una consulta.

Siempre referencia objetos del dominio.

Nunca texto plano.

---

# Plugin

Extensión del sistema.

Tipos:

* Importer
* Exporter
* Renderer
* OCR
* AI
* Tool

---

# Relaciones principales

<pre class="overflow-visible! px-0!" data-start="4185" data-end="4375"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼd ͼr"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>
Library

├── Workspace

├── Collection

├── Document

│ ├── Original Document

│ ├── UDM

│ │ └── UDM Node

│ ├── Metadata

│ ├── Layout

│ ├── Assets

│ └── Annotation

└── Plugin
</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

---

# Cardinalidades

Una Library

→ contiene muchos Documents.

Un Document

→ posee un único Original Document.

Un Document

→ posee un único UDM.

Un UDM

→ contiene muchos UDM Nodes.

Un Document

→ posee muchas Annotation.

Una Annotation

→ referencia un único UDM Node.

Un Document

→ posee muchos Assets.

Una Collection

→ contiene muchos Documents.

Un Document

→ puede pertenecer a muchas Collections.

---

# Invariantes del dominio

## Library

Existe una única Source of Truth.

---

## Document

Nunca pierde su identidad.

---

## Original Document

Nunca se modifica.

---

## UDM

Siempre representa el conocimiento vigente.

---

## Annotation

Nunca modifica el UDM.

---

## Layout

Puede regenerarse.

---

## Search Index

Puede regenerarse.

---

## Cache

Nunca contiene información única.
