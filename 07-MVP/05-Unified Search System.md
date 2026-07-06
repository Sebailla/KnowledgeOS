# 🔎 MVP Iteration 4 — Unified Search System

## 🎯 Objetivo

Permitir:

* buscar dentro de PDFs
* buscar dentro de anotaciones
* obtener resultados unificados
* saltar directamente al contexto exacto
* previsualizar fragmentos

---

# 🧠 Concepto clave

Antes tenías:

* búsqueda por documento

Ahora:

> un único índice de conocimiento local

---

# 🧩 Arquitectura del sistema

```text
User query
   ↓
Search Engine (local)
   ↓
Scan:
  - PDF text
  - Annotations
   ↓
Merge results
   ↓
Rank results
   ↓
Navigate to source
```

---

# 🧱 Paso 1 — Modelo de resultado de búsqueda

```swift
struct SearchResult: Identifiable {
    let id = UUID()
    let documentId: UUID
    let pageIndex: Int
    let snippet: String
    let type: ResultType
}

enum ResultType {
    case pdfText
    case annotation
}
```

---

# 🧱 Paso 2 — Search Engine simple

Versión MVP (sin IA, solo text search):

```swift
final class SearchEngine {

    func search(query: String, documents: [Document], annotations: [Annotation]) -> [SearchResult] {

        var results: [SearchResult] = []

        for doc in documents {
            if let text = loadPDFText(doc.filePath) {

                let matches = text
                    .components(separatedBy: ".")
                    .filter { $0.lowercased().contains(query.lowercased()) }

                for match in matches {
                    results.append(
                        SearchResult(
                            documentId: doc.id,
                            pageIndex: 0,
                            snippet: match,
                            type: .pdfText
                        )
                    )
                }
            }
        }

        for ann in annotations {
            if ann.text?.lowercased().contains(query.lowercased()) == true {
                results.append(
                    SearchResult(
                        documentId: ann.documentId,
                        pageIndex: ann.pageIndex,
                        snippet: ann.text ?? "",
                        type: .annotation
                    )
                )
            }
        }

        return results
    }
}
```

---

# 🧱 Paso 3 — UI de búsqueda

```swift
import SwiftUI

struct SearchView: View {

    @State private var query = ""
    @State private var results: [SearchResult] = []

    let engine = SearchEngine()

    var body: some View {
        VStack {

            TextField("Search knowledge...", text: $query)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            List(results) { result in
                VStack(alignment: .leading) {
                    Text(result.snippet)
                        .lineLimit(2)

                    Text(result.type == .annotation ? "Note" : "Document")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
        }
        .onChange(of: query) { newValue in
            results = engine.search(
                query: newValue,
                documents: loadDocuments(),
                annotations: loadAnnotations()
            )
        }
    }
}
```

---

# 🧱 Paso 4 — Navigation desde search

```swift
.onTapGesture {
    navigationManager.goTo(annotation: result.pageIndex)
}
```

---

# 🧠 Resultado del sistema

```text
User types query
   ↓
Search scans:
  - PDFs
  - annotations
   ↓
Results merged
   ↓
User clicks result
   ↓
Reader opens exact page
```

---

# 🔥 Qué lográs con esto

Ahora el sistema ya no es:

❌ lector + notas

Es:

✔ mini motor de búsqueda de conocimiento local

---

# 🧠 Cambio conceptual importante

Antes:

* “busco un documento”

Ahora:

> “busco una idea dentro de todo lo que leí”

---

# 🚀 Mejora opcional (muy importante)

### 1. Ranking simple

```swift
sort by relevance score
```

---

### 2. Snippet mejorado

Mostrar ±20 palabras alrededor del match.

---

### 3. Highlight automático en resultado

Cuando abres resultado:

* resaltar término buscado

---

### 4. Search en tiempo real (debounce)

```swift
DispatchQueue.main.asyncAfter(deadline: .now() + 0.3)
```

---

# 🔥 Resultado del MVP ahora

Ya tenés:

✔ lector PDF
✔ highlights
✔ notas
✔ panel de anotaciones
✔ navegación directa
✔ búsqueda unificada

---
