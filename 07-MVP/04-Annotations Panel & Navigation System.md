# 🧭 MVP Iteration 3 — Annotations Panel & Navigation System

## 🎯 Objetivo

Permitir:

* ver todas las anotaciones en un panel global
* filtrar por documento
* hacer click en una anotación → ir exactamente al punto del PDF
* convertir anotaciones en “mapa de estudio”

---

# 🧠 Concepto clave

Hasta ahora tenés:

> “anotaciones dentro del documento”

Ahora pasás a:

> “anotaciones como capa independiente de conocimiento”

---

# 🧩 Arquitectura de esta feature

```text
Annotation stored in DB
   ↓
AnnotationPanel loads all annotations
   ↓
User selects annotation
   ↓
Navigation event sent
   ↓
Reader scrolls to page + highlight
```

---

# 📁 Paso 1 — Annotation Panel UI

```swift
import SwiftUI

struct AnnotationPanelView: View {

    @State var annotations: [Annotation]

    var body: some View {
        List(annotations) { ann in
            VStack(alignment: .leading) {
                Text(ann.text ?? "No text")
                    .lineLimit(2)

                Text("Page \(ann.pageIndex)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .navigationTitle("Annotations")
    }
}
```

---

# 📌 Paso 2 — Agrupar por documento

```swift
func groupByDocument(_ annotations: [Annotation]) -> [UUID: [Annotation]] {
    Dictionary(grouping: annotations, by: { $0.documentId })
}
```

---

# 📌 Paso 3 — Navegación desde anotación

Necesitamos un “Navigation Bridge” entre panel y PDF.

```swift
final class NavigationManager: ObservableObject {

    @Published var selectedPage: Int? = nil

    func goTo(annotation: Annotation) {
        selectedPage = annotation.pageIndex
    }
}
```

---

# 📌 Paso 4 — Conectar con PDFView

```swift
func scrollTo(pageIndex: Int, pdfView: PDFView) {

    guard let document = pdfView.document,
          let page = document.page(at: pageIndex) else { return }

    pdfView.go(to: page)
}
```

---

# 📌 Paso 5 — Integración Panel → Reader

```swift
.onTapGesture {
    navigationManager.goTo(annotation: ann)
}
```

Y en Reader:

```swift
.onReceive(navigationManager.$selectedPage) { page in
    if let page = page {
        scrollTo(pageIndex: page, pdfView: pdfView)
    }
}
```

---

# 🧠 Resultado del flujo

```text
User opens Annotation Panel
   ↓
Sees all highlights & notes
   ↓
Clicks one annotation
   ↓
Reader opens document
   ↓
Scrolls directly to page
   ↓
Highlight visible
```

---

# 🔥 Qué cambia con esto

Antes:

* anotaciones = datos aislados

Ahora:

* anotaciones = sistema de navegación cognitiva

---

# 🧠 Esto es clave conceptualmente

Estás construyendo el primer “proto-knowledge graph” sin llamarlo así:

* nodos = anotaciones
* edges = documento/página
* navegación = relaciones

---

# 🚀 Mejora opcional (muy importante)

### 1. Preview contextual

Mostrar snippet más largo del texto.

---

### 2. Search en anotaciones

```swift
filter { $0.text.contains(query) }
```

---

### 3. Tags (mini semantic layer)

```swift
tags: [String]
```

Ej:

* “cardio”
* “study”
* “important”

---

# 🔥 Resultado del MVP ahora

Ya tenés:

✔ lector PDF
✔ highlights persistentes
✔ notas tipo post-it
✔ panel global de anotaciones
✔ navegación directa desde conocimiento

---
