
# 🧱 MVP Architecture — KnowledgeOS (v0.1)

## 🎯 Objetivo del MVP

Construir una app que permita:

* importar PDFs / ePub / CHM
* convertirlos a un modelo interno (simplificado UDM)
* visualizarlo en 3 modos:

  * reader tipo libro
  * modo anotación
  * modo estructura (outline)
* permitir highlights + notas
* guardar todo local-first

---

# 📦 Stack recomendado (realista para 1 persona)

## 🧠 App principal

* Swift + SwiftUI
* iOS / iPadOS (prioridad iPad)
* macOS (Catalyst opcional después)

---

## 💾 Persistencia

* SQLite (via GRDB.swift o CoreData si querés simple)
* archivo original guardado en filesystem
* metadata en DB

---

## 📄 Parsing inicial (simplificado)

* PDFKit (Apple)
* EPUBKit (lib open source)
* CHM → parser externo o conversión previa

---

## 🔍 Search

* full-text search SQLite (FTS5)

---

## ✍️ Annotations

* overlay SwiftUI
* storage como “Annotation table”

---

# 🧩 MVP Data Model (versión simplificada del UDM)

Olvidamos grafo completo por ahora.

Solo esto:

```swift
Document {
    id
    title
    sourceType (pdf/epub/chm)
    filePath
}

Page {
    id
    documentId
    index
    textBlocks
}

Block {
    id
    pageId
    text
    bbox (optional)
}

Annotation {
    id
    blockId
    type (highlight/note)
    content
    color
    position
}
```

---

# 🧠 Qué eliminamos del sistema grande (por ahora)

Para MVP NO hacemos:

* Graph Intelligence
* Synthesis Engine
* UDM completo
* Orchestration layer
* Memory system
* KEG

👉 todo eso queda conceptual

---

# 🧭 MVP UX (3 pantallas)

---

## 1. Library View

* lista de documentos
* drag & drop import
* estado de procesamiento

---

## 2. Reader View (CORE)

* render PDF / texto
* highlights
* scroll fluido
* selección de texto

---

## 3. Notes / Annotations View

* lista de notas
* saltar a ubicación original
* editar etiquetas

---

# ⚙️ Pipeline MVP (simplificado)

```text
Import File
   ↓
Parse (PDFKit / EPUB)
   ↓
Extract Text Blocks
   ↓
Store SQLite
   ↓
Render Reader
   ↓
Annotations Layer
```

---

# 🔥 MVP Feature Set (lo que SÍ o SÍ debe existir)

## Must have

* importar PDF
* leer documento fluido
* seleccionar texto
* highlight persistente
* nota tipo post-it
* persistencia local

---

## Should have

* EPUB support
* search dentro documento
* bookmarks

---

## Nice to have

* CHM support
* export notes
* iCloud sync

---

# 🚀 Evolución futura (después del MVP)

Cuando esto funcione:

1. introduces UDM real
2. agregas estructura (SDM)
3. luego layout (LDM)
4. luego graph
5. luego synthesis

---

# 🧠 Regla clave de implementación

> Si algo no se puede construir en 2–4 semanas → no entra al MVP

---

# 📌 Arquitectura final del MVP

```text
SwiftUI App
   ↓
Document Parser (PDFKit)
   ↓
SQLite Store
   ↓
Reader Engine
   ↓
Annotation Layer
   ↓
UI Modes
```

---

# 🎯 Resultado esperado del MVP

Tener una app que:

* reemplaza Apple Books para estudio
* permite anotar papers reales
* soporta investigación médica (tu caso perfecto)
* funciona offline
* es rápida y simple

---
