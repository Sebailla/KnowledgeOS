# 🧭 MVP Iteration 7 — Graph Explorer UI (Mini KEG)

## 🎯 Objetivo

Crear una vista visual donde el usuario pueda:

* ver el grafo de conocimiento
* explorar nodos y relaciones
* expandir conexiones
* navegar de forma no lineal
* entender “cómo está conectado lo que lee”

---

# 🧠 Concepto clave

Antes:

> el grafo existe pero no se ve

Ahora:

> el grafo es una interfaz de exploración del conocimiento

---

# 🧩 Arquitectura de esta feature

```text
Graph Data (nodes + edges)
   ↓
Graph Layout Engine
   ↓
Visual Nodes
   ↓
Interaction Layer
   ↓
Navigation System
```

---

# 📦 Paso 1 — ViewModel del grafo

```swift
import Foundation

final class GraphViewModel: ObservableObject {

    @Published var nodes: [Node] = []
    @Published var edges: [Edge] = []

    func load(nodes: [Node], edges: [Edge]) {
        self.nodes = nodes
        self.edges = edges
    }
}
```

---

# 🧠 Paso 2 — Layout simple (MVP)

No usamos force graph complejo todavía.

Usamos grid radial simple:

```swift
func layout(nodes: [Node]) -> [UUID: CGPoint] {

    var positions: [UUID: CGPoint] = [:]

    let center = CGPoint(x: 200, y: 200)
    let radiusStep: CGFloat = 80

    for (index, node) in nodes.enumerated() {

        let angle = Double(index) * (2 * .pi / Double(nodes.count))
        let radius = radiusStep * CGFloat(index % 3 + 1)

        let x = center.x + radius * cos(angle)
        let y = center.y + radius * sin(angle)

        positions[node.id] = CGPoint(x: x, y: y)
    }

    return positions
}
```

---

# 🧠 Paso 3 — Node View

```swift
import SwiftUI

struct GraphNodeView: View {

    let node: Node
    let position: CGPoint
    let onTap: (Node) -> Void

    var body: some View {
        Text(node.text)
            .padding(8)
            .background(Color.blue.opacity(0.2))
            .cornerRadius(8)
            .position(position)
            .onTapGesture {
                onTap(node)
            }
    }
}
```

---

# 🧠 Paso 4 — Graph Canvas

```swift
import SwiftUI

struct GraphExplorerView: View {

    @StateObject var vm = GraphViewModel()

    var body: some View {

        let positions = layout(nodes: vm.nodes)

        ZStack {

            ForEach(vm.edges) { edge in
                EdgeView(edge: edge)
            }

            ForEach(vm.nodes) { node in
                if let pos = positions[node.id] {
                    GraphNodeView(node: node, position: pos) { selected in
                        navigate(to: selected)
                    }
                }
            }
        }
    }
}
```

---

# 🧠 Paso 5 — Edge View (simplificado)

```swift
struct EdgeView: View {

    let edge: Edge

    var body: some View {
        Path { path in
            path.move(to: CGPoint(x: 100, y: 100))
            path.addLine(to: CGPoint(x: 200, y: 200))
        }
        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
    }
}
```

---

# 🧠 Paso 6 — Interacción clave

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

# 🔥 Resultado del sistema

```text
Graph Data
   ↓
Visual Layout
   ↓
Interactive Nodes
   ↓
User taps node
   ↓
App navigates to PDF / annotation
```

---

# 🧠 Cambio conceptual importante

Antes:

* “leo y anoto documentos”

Ahora:

> “exploro un mapa de conocimiento”

---

# 🚀 Qué lográs con esto

✔ primera interfaz de grafo
✔ navegación no lineal real
✔ conexión visual entre ideas
✔ base para KEG real (exploración dinámica)

---

# 🧪 Mejora opcional (muy valiosa)

### 1. Zoom + Pan

```swift
MagnificationGesture()
DragGesture()
```

---

### 2. Highlight de subgrafo

Cuando seleccionas nodo:

* resaltar vecinos

---

### 3. Expandir nodos

Tap → cargar más relaciones

---

### 4. Animaciones suaves

* transición de expansión
* movimiento de nodos

---

# 🔥 Estado actual del MVP

Ya tenés:

✔ lector PDF
✔ anotaciones
✔ search
✔ UDM light
✔ graph layer
✔ graph explorer UI

---
