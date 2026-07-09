
# C4 Level 3 – Annotation Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Gestionar todo el conocimiento generado por el usuario sin modificar el documento original.

El Annotation Engine administra las anotaciones como capas independientes asociadas al Universal Document Model (UDM).

---

# Responsabilidades

- Crear anotaciones.
- Editar anotaciones.
- Eliminar anotaciones.
- Gestionar resaltados.
- Gestionar notas.
- Gestionar dibujos.
- Gestionar Apple Pencil.
- Gestionar marcadores.
- Gestionar stickers.
- Gestionar comentarios.
- Gestionar enlaces entre anotaciones.

---

# No es responsable de

- Persistencia del documento.
- Renderizado.
- IA.
- Búsqueda.
- Sincronización.
- Exportación.

---

# Componentes

## Annotation Service

API pública del Engine.

---

## Highlight Manager

Gestiona resaltados.

---

## Note Manager

Gestiona notas.

---

## Drawing Manager

Gestiona dibujos y trazos.

---

## Bookmark Manager

Gestiona marcadores.

---

## Sticker Manager

Gestiona stickers y post-its.

---

## Link Manager

Gestiona relaciones entre anotaciones.

---

## Annotation Repository

Acceso a las anotaciones persistidas.

---

## Event Publisher

Publica eventos relacionados con anotaciones.

---

# Tipos de anotaciones

- Highlight
- Underline
- Note
- Free Text
- Drawing
- Apple Pencil Stroke
- Bookmark
- Sticker
- Comment
- Link

---

# Contratos Públicos

- CreateAnnotation
- UpdateAnnotation
- DeleteAnnotation
- GetAnnotations
- GetAnnotationsByPage
- CreateBookmark
- CreateHighlight
- CreateDrawing

---

# Eventos Publicados

- AnnotationCreated
- AnnotationUpdated
- AnnotationDeleted
- BookmarkCreated
- HighlightCreated

---

# Reglas

1. Nunca modifica el documento original.
2. Toda anotación pertenece a un documento.
3. Toda anotación posee identidad propia.
4. Las anotaciones pueden superponerse.
5. Las anotaciones son independientes del renderizado.

---

# Dependencias

- Library Engine
- Event Bus

---

# Decisiones Congeladas

1. Las anotaciones constituyen una capa independiente del documento.
2. El documento original permanece inmutable.
3. Todo cambio genera eventos.
4. El Render Engine es responsable de representar visualmente las anotaciones.
