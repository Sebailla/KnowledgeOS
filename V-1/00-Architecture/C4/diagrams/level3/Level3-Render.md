# C4 Level 3 – Render Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Transformar el Universal Document Model (UDM) en representaciones visuales sin modificar el conocimiento almacenado.

El Render Engine es responsable exclusivamente de la presentación del contenido.

---

# Responsabilidades

- Renderizar documentos.
- Aplicar temas.
- Aplicar tipografías.
- Gestionar layouts.
- Renderizar imágenes.
- Renderizar tablas.
- Renderizar ecuaciones.
- Renderizar anotaciones.
- Generar vistas de lectura.

---

# No es responsable de

- Persistencia.
- Modificación del UDM.
- Búsquedas.
- IA.
- Sincronización.
- Exportación.

---

# Componentes

## Render Service

API pública del Engine.

---

## Layout Manager

Selecciona el layout apropiado.

---

## Theme Manager

Gestiona temas visuales.

---

## Typography Manager

Gestiona tipografías.

---

## Media Renderer

Renderiza imágenes, audio y vídeo.

---

## Table Renderer

Renderiza tablas.

---

## Formula Renderer

Renderiza expresiones matemáticas.

---

## Annotation Renderer

Renderiza anotaciones del usuario.

---

## View Builder

Construye la representación final.

---

# Layouts soportados

- Reader
- Book
- Magazine
- Paper
- Web
- Presentation

---

# Contratos Públicos

- RenderDocument
- RenderPage
- RenderSelection
- RenderPreview
- ChangeTheme
- ChangeLayout

---

# Reglas

1. Nunca modifica el UDM.
2. Todo render es reproducible.
3. El render depende únicamente del UDM y de la configuración visual.
4. Las anotaciones son capas independientes.

---

# Dependencias

- Library Engine
- Annotation Engine

---

# Decisiones Congeladas

1. El Render Engine no posee datos propios.
2. El UDM constituye la única fuente de entrada.
3. Toda representación visual es efímera.
