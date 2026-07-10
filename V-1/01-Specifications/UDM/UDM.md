# Universal Document Model (UDM)

Version: 1.0

Status: Draft

---

# Objetivo

El Universal Document Model (UDM) es el formato interno de KnowledgeOS.

Todo documento importado será convertido al UDM.

Los formatos originales (PDF, EPUB, DOCX, CHM, HTML, Markdown, TXT, etc.) nunca serán utilizados directamente por el motor del sistema.

---

# Principios

- Independiente del formato de origen.
- Independiente del renderizador.
- Independiente de la plataforma.
- Independiente de la IA.
- Independiente del almacenamiento.

---


# Arquitectura

El Universal Document Model está compuesto por ocho capas independientes.


Knowledge Document

├── Identity Layer

├── Content Layer

├── Structure Layer

├── Layout Layer

├── Style Layer

├── Annotation Layer

├── Knowledge Layer

└── Provenance Layer



## Identity Layer

Identidad permanente del documento y sus nodos.

Incluye:

- DocumentID
- OriginalID
- VersionID
- ContentHash
- SchemaVersion

## Content Layer

Contenido lógico del documento.

Incluye:

- capítulos
- secciones
- párrafos
- listas
- tablas
- imágenes
- fórmulas
- código
- referencias

## Structure Layer

Estructura jerárquica y relaciones internas.

Incluye:

- parent
- child
- order
- nodePath
- relationships

## Layout Layer

Disposición física del documento original.

Incluye:

- páginas
- columnas
- regiones
- bounding boxes
- reading order

## Style Layer

Apariencia visual.

Incluye:

- tipografía
- colores
- márgenes
- espaciado
- bordes
- fondos

## Annotation Layer

Información creada por el usuario.

Incluye:

- highlights
- sticky notes
- ink
- bookmarks
- comments
- shapes

## Knowledge Layer

Conocimiento derivado.

Incluye:

- entities
- concepts
- topics
- embeddings
- summaries
- relationships
- backlinks
- classifications

## Provenance Layer

Trazabilidad del documento.

Incluye:

- archivo original
- formato original
- importador
- versión del importador
- OCR utilizado
- historial de procesamiento
- historial de migraciones


# Identidad

Cada elemento posee un UUID permanente.

Nunca cambia durante la vida del documento.

---

# Anchors

Todo elemento puede actuar como Anchor.

Ejemplo

Document

↓

Chapter

↓

Paragraph

↓

Text Range

↓

Character Range

Las anotaciones siempre apuntan a un Anchor.

Nunca a coordenadas de pantalla.

---

# Relaciones

Los nodos pueden relacionarse mediante:

Contains

References

DependsOn

Continues

BelongsTo

GeneratedFrom

LinkedTo

AnnotatedBy

---

# Versionado

Cada documento posee:

Document Version

Layout Version

Annotation Version

Semantic Version

Cada una evoluciona de forma independiente.

---

# Inmutabilidad

El documento original nunca es modificado.

El UDM representa una copia enriquecida.

---

# Compatibilidad

Todos los renderizadores trabajan exclusivamente con el UDM.

Book Renderer

Magazine Renderer

Paper Renderer

Editor Renderer

Web Renderer

Future Renderers

---

# Persistencia

El UDM puede serializarse en:

JSON

Binary

SQLite

Future Formats

---

# Beneficios

- Un único modelo para todos los formatos.
- Renderizado independiente.
- IA independiente.
- Sincronización independiente.
- Plugins independientes.
- Exportación independiente.
