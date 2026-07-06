---
# ✍️ MVP Iteration 2 — Real PDF Highlights (PDFKit)

## 🎯 Objetivo

Permitir:

* seleccionar texto en PDF
* crear highlight real (visual en el documento)
* guardar esa selección en SQLite
* restaurar highlights al reabrir el PDF
---
# 🧠 Problema real (importante)

PDFKit NO guarda anotaciones automáticamente en tu modelo.

Tú debes sincronizar:

* selección visual (PDFKit)
* coordenadas / referencias
* modelo persistente (SQLite)

---

# 🧩 Arquitectura de esta feature

```text
User selects text
   ↓
PDFSelection (PDFKit)
   ↓
Extract:
   - pageIndex
   - range / string
   - bounds
   ↓
Create Annotation model
   ↓
Save to SQLite
   ↓
Render highlight overlay
```

---

# 📌 Paso 1 — Detectar selección en PDFKit

Necesitas capturar la selección del usuario:

```swift
import PDFKit

final class PDFSelectionHandler: NSObject {

    weak var pdfView: PDFView?

    init(pdfView: PDFView) {
        self.pdfView = pdfView
    }

    func getCurrentSelection() -> PDFSelection? {
        return pdfView?.currentSelection
    }
}
```

---

# 📌 Paso 2 — Extraer datos de la selección

```swift
func extractSelectionData(_ selection: PDFSelection, documentId: UUID) -> Annotation? {

    guard let page = selection.pages.first else { return nil }

    let pageIndex = page.pageRef?.pageNumber ?? 0
    let text = selection.string ?? ""

    return Annotation(
        id: UUID(),
        documentId: documentId,
        pageIndex: pageIndex,
        text: text,
        color: "yellow",
        note: nil,
        createdAt: Date()
    )
}
```

---

# 📌 Paso 3 — Crear highlight visual

PDFKit ya soporta highlights nativos:

```swift
func addHighlight(selection: PDFSelection) {
    selection.color = UIColor.yellow
    selection.pages.forEach { page in
        page.addAnnotation(PDFAnnotation(
            bounds: selection.bounds(for: page),
            forType: .highlight,
            withProperties: nil
        ))
    }
}
```

---

# 📌 Paso 4 — Persistencia en SQLite

```swift
func save(annotation: Annotation) {
    let query = """
    INSERT INTO annotations
    (id, documentId, pageIndex, text, color, note, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """
}
```

---

# 📌 Paso 5 — Restaurar highlights al abrir PDF

```swift
func restoreAnnotations(for pdfView: PDFView, annotations: [Annotation]) {

    guard let document = pdfView.document else { return }

    for annotation in annotations {

        guard let page = document.page(at: annotation.pageIndex) else { continue }

        let pdfAnnotation = PDFAnnotation(
            bounds: page.bounds(for: .mediaBox),
            forType: .highlight,
            withProperties: nil
        )

        pdfAnnotation.color = UIColor.yellow
        page.addAnnotation(pdfAnnotation)
    }
}
```

---

# 🧠 Flujo completo ahora

```text
User selects text
   ↓
PDFSelection captured
   ↓
Annotation created
   ↓
Saved in SQLite
   ↓
Highlight rendered in PDF
   ↓
On reopen → restored
```

---

# ⚠️ Problema importante (te lo anticipo)

PDFKit tiene limitaciones:

* selección no siempre exacta en PDFs escaneados
* bounding boxes inconsistentes
* texto fragmentado en columnas

👉 esto será crítico cuando entres en:

> libros escaneados + OCR + layout reconstruction

---

# 🚀 Mejora opcional (nivel pro)

Puedes mejorar highlights usando:

### 1. Bounding box exacto por palabra

* iterar `selection.selectionsByLine()`

### 2. Multi-page highlights

* dividir selección por página

### 3. Persistencia robusta

guardar no solo texto, sino:

```text
pageIndex
startOffset
endOffset
boundingRects[]
```

---

# 🔥 Resultado de esta iteración

Ahora el MVP ya tiene:

✔ lector real
✔ selección de texto
✔ highlights persistentes
✔ anotaciones guardadas
✔ restauración automática

---
