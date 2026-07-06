# 🕸️ MVP Iteration 6 — Graph Layer Lite (Pre-Knowledge Graph)

## 🎯 Objetivo

Crear la primera versión de un grafo de conocimiento que conecte:

* bloques de texto
* anotaciones
* secciones
* documentos

Sin IA pesada. Solo reglas simples + estructura.

---

# 🧠 Concepto clave

Antes:

> documentos estructurados (UDM Light)

Ahora:

> ideas conectadas entre documentos

---

# 📦 Modelo de grafo MVP

```swift
struct Node: Identifiable {
    let id: UUID
    let type: NodeType
    let text: String
    let documentId: UUID
    let blockId: UUID?
}

enum NodeType {
    case document
    case section
    case block
    case annotation
}

struct Edge: Identifiable {
    let id: UUID
    let from: UUID
    let to: UUID
    let type: EdgeType
    let weight: Double
}

enum EdgeType {
    case contains
    case references
    case similarity
    case annotationOf
}
```

---

# 🧠 Paso 1 — Construcción del grafo

## Regla MVP (simple y efectiva)

```text
- Document → Section (contains)
- Section → Block (contains)
- Annotation → Block (annotationOf)
```

---

## Builder

```swift
final class GraphBuilder {

    func build(from document: UDMDocument, annotations: [Annotation]) -> (nodes: [Node], edges: [Edge]) {

        var nodes: [Node] = []
        var edges: [Edge] = []

        let docNode = Node(
            id: document.id,
            type: .document,
            text: document.title,
            documentId: document.id,
            blockId: nil
        )

        nodes.append(docNode)

        for section in document.sections {

            let sectionNode = Node(
                id: section.id,
                type: .section,
                text: section.title,
                documentId: document.id,
                blockId: nil
            )

            nodes.append(sectionNode)

            edges.append(Edge(
                id: UUID(),
                from: docNode.id,
                to: sectionNode.id,
                type: .contains,
                weight: 1.0
            ))

            for block in section.blocks {

                let blockNode = Node(
                    id: block.id,
                    type: .block,
                    text: block.text,
                    documentId: document.id,
                    blockId: block.id
                )

                nodes.append(blockNode)

                edges.append(Edge(
                    id: UUID(),
                    from: sectionNode.id,
                    to: blockNode.id,
                    type: .contains,
                    weight: 1.0
                ))
            }
        }

        for annotation in annotations {

            let annNode = Node(
                id: annotation.id,
                type: .annotation,
                text: annotation.text ?? "",
                documentId: annotation.documentId,
                blockId: nil
            )

            nodes.append(annNode)

            edges.append(Edge(
                id: UUID(),
                from: annotation.id,
                to: annotation.documentId,
                type: .annotationOf,
                weight: 1.0
            ))
        }

        return (nodes, edges)
    }
}
```

---

# 🧠 Paso 2 — Visualización del grafo (debug mode)

```swift
struct GraphView: View {

    let nodes: [Node]
    let edges: [Edge]

    var body: some View {
        List(nodes) { node in
            VStack(alignment: .leading) {
                Text(node.text)
                    .font(.headline)

                Text("\(node.type)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
    }
}
```

---

# 🧠 Paso 3 — Navegación basada en grafo

Ahora puedes:

* click en nodo → ir al documento
* click en annotation → ir al bloque exacto
* expandir relaciones

```swift
func navigate(to node: Node) {
    switch node.type {
    case .document:
        openDocument(node.documentId)
    case .block:
        scrollToBlock(node.blockId)
    case .annotation:
        openAnnotation(node.id)
    default:
        break
    }
}
```

---

# 🧠 Paso 4 — Similaridad simple (opcional MVP+)

Sin IA, solo heurística:

```swift
func similarity(_ a: String, _ b: String) -> Double {
    let setA = Set(a.lowercased().split(separator: " "))
    let setB = Set(b.lowercased().split(separator: " "))

    let intersection = setA.intersection(setB)
    let union = setA.union(setB)

    return Double(intersection.count) / Double(union.count)
}
```

👉 si similarity > 0.3 → Edge `.similarity`

---

# 🔥 Resultado del sistema

```text
PDF → UDM Light
   ↓
Nodes + Edges
   ↓
Graph Layer Lite
   ↓
Navigation + relationships
```

---

# 🧠 Cambio conceptual fuerte

Antes:

* lees documentos

Ahora:

> navegas relaciones entre ideas

---

# 🚀 Qué lográs con esto

✔ estructura de conocimiento viva
✔ conexiones entre anotaciones
✔ navegación no lineal
✔ base del Knowledge Graph real

---
