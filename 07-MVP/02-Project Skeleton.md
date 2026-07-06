# 🧱 MVP Project Skeleton — KnowledgeOS (Swift)

## 🎯 Objetivo

Dejar el proyecto listo con:

* arquitectura clara
* carpetas definidas
* modelos base
* navegación mínima
* PDF viewer funcionando
* base de persistencia lista

---

# 📁 Estructura del proyecto (Xcode)

```text
KnowledgeOS/
│
├── App/
│   └── KnowledgeOSApp.swift
│
├── Core/
│   ├── Models/
│   │   ├── Document.swift
│   │   ├── Annotation.swift
│   │   └── Bookmark.swift
│   │
│   ├── Database/
│   │   ├── DatabaseManager.swift
│   │   └── Schema.sql (opcional si usas SQLite raw)
│   │
│   └── Utils/
│       ├── FileImporter.swift
│       └── PDFParser.swift
│
├── Features/
│   ├── Library/
│   │   ├── LibraryView.swift
│   │   └── LibraryViewModel.swift
│   │
│   ├── Reader/
│   │   ├── ReaderView.swift
│   │   └── ReaderViewModel.swift
│   │
│   └── Annotations/
│       ├── AnnotationOverlay.swift
│       └── AnnotationManager.swift
│
├── Resources/
│
└── Storage/
```

---

# 🧠 MODELOS BASE (Swift)

---

## 📄 Document.swift

```swift
import Foundation

struct Document: Identifiable, Codable {
    let id: UUID
    var title: String
    var filePath: String
    var pageCount: Int
    var createdAt: Date
}
```

---

## 📝 Annotation.swift

```swift
import Foundation
import SwiftUI

struct Annotation: Identifiable, Codable {
    let id: UUID
    let documentId: UUID
    var pageIndex: Int
    var text: String?
    var color: String
    var note: String?
    var createdAt: Date
}
```

---

## 🔖 Bookmark.swift

```swift
import Foundation

struct Bookmark: Identifiable, Codable {
    let id: UUID
    let documentId: UUID
    var pageIndex: Int
    var createdAt: Date
}
```

---

# 💾 Database Manager (SQLite simple)

```swift
import Foundation
import SQLite3

final class DatabaseManager {
    static let shared = DatabaseManager()
  
    private var db: OpaquePointer?

    func open() {
        let url = FileManager.default
            .urls(for: .documentDirectory, in: .userDomainMask)
            .first!
            .appendingPathComponent("knowledgeos.sqlite")

        if sqlite3_open(url.path, &db) != SQLITE_OK {
            print("Error opening database")
        }

        createTables()
    }

    private func createTables() {
        let documentsTable = """
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            title TEXT,
            filePath TEXT,
            pageCount INTEGER,
            createdAt DOUBLE
        );
        """

        sqlite3_exec(db, documentsTable, nil, nil, nil)
    }
}
```

---

# 📦 PDF IMPORTER (MVP)

```swift
import PDFKit
import Foundation

final class PDFParser {

    func loadPDF(url: URL) -> PDFDocument? {
        return PDFDocument(url: url)
    }

    func pageCount(for document: PDFDocument) -> Int {
        return document.pageCount
    }
}
```

---

# 📚 LIBRARY VIEW (UI base)

```swift
import SwiftUI

struct LibraryView: View {
    @State private var documents: [Document] = []

    var body: some View {
        NavigationView {
            List(documents) { doc in
                NavigationLink(destination: ReaderView(document: doc)) {
                    Text(doc.title)
                }
            }
            .navigationTitle("Library")
        }
    }
}
```

---

# 📖 READER VIEW (PDF básico)

```swift
import SwiftUI
import PDFKit

struct ReaderView: View {
    let document: Document

    var body: some View {
        PDFKitView(url: URL(fileURLWithPath: document.filePath))
    }
}

struct PDFKitView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> PDFView {
        let pdfView = PDFView()
        pdfView.document = PDFDocument(url: url)
        pdfView.autoScales = true
        return pdfView
    }

    func updateUIView(_ uiView: PDFView, context: Context) {}
}
```

---

# ✍️ ANOTATION LAYER (base futura)

```swift
import Foundation

final class AnnotationManager {
    static let shared = AnnotationManager()

    private var annotations: [Annotation] = []

    func add(annotation: Annotation) {
        annotations.append(annotation)
    }

    func get(for documentId: UUID) -> [Annotation] {
        annotations.filter { $0.documentId == documentId }
    }
}
```

---

# 🚀 APP ENTRY POINT

```swift
import SwiftUI

@main
struct KnowledgeOSApp: App {

    init() {
        DatabaseManager.shared.open()
    }

    var body: some Scene {
        WindowGroup {
            LibraryView()
        }
    }
}
```

---

# 🧭 Flujo real del MVP ahora

```text
App Launch
   ↓
LibraryView
   ↓
Select Document
   ↓
ReaderView (PDFKit)
   ↓
Annotations Layer (v2)
```

---

# 🔥 Qué ya tenés con esto

✔ App abre en SwiftUI
✔ Biblioteca de documentos
✔ PDF viewer real
✔ Base de anotaciones
✔ DB inicial
✔ Arquitectura escalable

---

# ❌ Qué NO está todavía (intencionalmente)

* UDM
* graph system
* synthesis
* memory layer
* search avanzada

👉 eso viene después

---
