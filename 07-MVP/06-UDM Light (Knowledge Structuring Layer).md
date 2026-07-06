# 🧠 MVP Iteration 5 — UDM Light (Knowledge Structuring Layer)

## 🎯 Objetivo

Convertir documentos planos en una estructura semántica mínima:

* secciones detectadas
* bloques de contenido
* conceptos simples
* relación básica entre ideas

Sin IA compleja todavía.

---

# 🧩 Concepto clave

Antes tenías:

> texto plano + anotaciones

Ahora:

> documento con estructura de conocimiento

---

# 📦 UDM Light (versión MVP)

```swift
struct UDMDocument {
    let id: UUID
    let title: String
    let sections: [UDMSection]
}

struct UDMSection {
    let id: UUID
    let title: String
    let blocks: [UDMBlock]
}

struct UDMBlock {
    let id: UUID
    let text: String
    let type: BlockType
}

enum BlockType {
    case paragraph
    case heading
    case list
}
```

---

# 🧠 Paso 1 — Detectar estructura del PDF

MVP rule (sin IA):

```text
- líneas en mayúscula → heading
- saltos de línea largos → paragraph
- bullets → list
```

---

# 🧱 Parser simple

```swift
final class UDMParser {

    func parse(text: String) -> UDMDocument {

        let lines = text.components(separatedBy: "\n")

        var sections: [UDMSection] = []
        var currentBlocks: [UDMBlock] = []

        for line in lines {

            if isHeading(line) {
                let section = UDMSection(
                    id: UUID(),
                    title: line,
                    blocks: []
                )
                sections.append(section)
            } else {
                let block = UDMBlock(
                    id: UUID(),
                    text: line,
                    type: detectType(line)
                )
                currentBlocks.append(block)
            }
        }

        return UDMDocument(
            id: UUID(),
            title: "Parsed Document",
            sections: sections
        )
    }

    func isHeading(_ line: String) -> Bool {
        return line.uppercased() == line && line.count < 80
    }

    func detectType(_ line: String) -> BlockType {
        if line.starts(with: "-") { return .list }
        return .paragraph
    }
}
```

---

# 🧠 Paso 2 — Visualización estructurada

Ahora no solo PDF, también modo “documento estructurado”:

```swift
struct StructuredReaderView: View {

    let document: UDMDocument

    var body: some View {
        List {
            ForEach(document.sections, id: \.id) { section in
                Section(header: Text(section.title)) {
                    ForEach(section.blocks, id: \.id) { block in
                        Text(block.text)
                    }
                }
            }
        }
    }
}
```

---

# 🧠 Paso 3 — Conectar UDM con anotaciones

```swift
Annotation {
    sectionId: UUID?
    blockId: UUID?
}
```

👉 ahora las anotaciones dejan de ser “posiciones”

y pasan a ser:

> conocimiento ligado a estructura

---

# 🧠 Paso 4 — Search mejora con UDM

Ahora la búsqueda puede ser:

* por sección
* por bloque
* por concepto (texto dentro de bloque)

---

# 🔥 Resultado del sistema

```text
PDF → texto
   ↓
UDM Light
   ↓
sections + blocks
   ↓
annotations linkeadas
   ↓
search estructurado
```

---

# 🧠 Cambio conceptual importante

Antes:

* “busco texto”

Ahora:

> “navego estructura de conocimiento”

---

# 🚀 Mejora opcional (muy importante)

### 1. Auto index de secciones

Crear índice lateral tipo libro:

```text
- Introduction
- Methods
- Results
- Discussion
```

---

### 2. Concept extraction simple

Reglas MVP:

* palabras repetidas → concepto
* headings → conceptos fuertes

---

### 3. Linking básico

Si un bloque menciona otro:

* crear link interno simple

---

# 🔥 Qué lográs ahora

✔ lector estructurado tipo libro académico
✔ anotaciones conectadas a estructura
✔ search más inteligente
✔ navegación por secciones

---
