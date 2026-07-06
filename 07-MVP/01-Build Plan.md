# 🗺️ MVP Build Plan — KnowledgeOS (14 días)

## 🎯 Objetivo general

En 14 días tener una app funcional que permita:

* importar PDFs
* leerlos
* resaltarlos
* anotarlos
* guardarlos localmente
* navegar entre documentos

---

# 🧱 Semana 1 — Fundaciones del sistema

---

## 📅 Día 1 — Setup del proyecto

**Objetivo:** app corriendo con estructura limpia

* Crear proyecto SwiftUI (macOS o iPadOS)
* Definir arquitectura base:

  * /Core
  * /Features
  * /Data
* Integrar SwiftData o SQLite (elegir uno)
* Crear navegación básica (Library → Reader)

---

## 📅 Día 2 — Modelo de datos

**Objetivo:** persistencia mínima funcional

Crear entidades:

* Document
* Page
* Block (opcional simplificado)
* Annotation

Funciones:

* guardar documento
* listar documentos

---

## 📅 Día 3 — Importador PDF

**Objetivo:** cargar PDFs reales

* integrar PDFKit
* abrir archivo desde Files app
* guardar path en DB
* mostrar metadata básica (title, pages)

---

## 📅 Día 4 — Render del documento

**Objetivo:** lector básico funcional

* mostrar PDF en pantalla
* scroll fluido
* navegación por páginas

👉 sin anotaciones todavía

---

## 📅 Día 5 — Selección de texto

**Objetivo:** interacción base

* detectar selección de texto en PDF
* capturar rango seleccionado
* preparar hook para highlight

---

## 📅 Día 6 — Highlights v1

**Objetivo:** primer sistema de anotación

* seleccionar texto → highlight
* guardar color + rango
* persistencia en DB
* re-render al abrir documento

---

## 📅 Día 7 — Notes (post-it)

**Objetivo:** anotaciones reales

* crear nota flotante
* attach a selección o página
* editar texto
* persistencia

---

# 🧱 Semana 2 — Producto usable

---

## 📅 Día 8 — Library UI

**Objetivo:** experiencia tipo app real

* lista de documentos
* búsqueda básica
* import button
* delete document

---

## 📅 Día 9 — Search local

**Objetivo:** búsqueda funcional

* SQLite FTS o simple text search
* buscar dentro de documentos
* highlight resultados

---

## 📅 Día 10 — UX polish lector

**Objetivo:** lectura cómoda

* modo noche / día
* tipografía ajustable
* spacing control básico

---

## 📅 Día 11 — Bookmarks

**Objetivo:** navegación rápida

* marcar páginas
* lista de bookmarks
* jump to page

---

## 📅 Día 12 — Annotations panel

**Objetivo:** sistema de notas centralizado

* lista global de notas
* filtro por documento
* click → navegar al punto exacto

---

## 📅 Día 13 — Stabilization

**Objetivo:** estabilidad

* bug fixing
* performance scroll PDF
* optimizar storage
* limpiar arquitectura

---

## 📅 Día 14 — MVP Release

**Objetivo:** versión usable real

* export build
* test en uso real (leer + anotar paper completo)
* medir fricción
* listar mejoras

---

# 🧠 Arquitectura real del MVP (final)

```text
UI (SwiftUI)
   ↓
PDFKit Reader
   ↓
Annotation Layer
   ↓
SQLite Storage
   ↓
Document Manager
```

---

# 🔥 Lo importante aquí

Este MVP NO intenta ser KnowledgeOS completo.

Es:

> un lector de conocimiento con anotación persistente

---

# 🚀 Punto crítico (muy importante)

Si este MVP funciona bien, recién ahí agregás:

### Fase 2 (Knowledge Layer)

* UDM simplificado
* estructura de documentos
* búsqueda semántica

### Fase 3 (Graph)

* relaciones entre documentos
* notas conectadas

### Fase 4 (AI)

* síntesis
* reasoning
* KEG

---

# 📌 Decisión clave de producto

Este MVP responde a:

> “¿puedo leer, entender y anotar documentos mejor que en Apple Books?”

NO intenta todavía:

* reemplazar Notion
* ser un grafo
* ser IA completa

---
