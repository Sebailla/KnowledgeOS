# ADR-002 - Universal Document Model

**Estado:** Accepted

---

# Contexto

KnowledgeOS debe soportar múltiples formatos de entrada.

El formato interno no puede depender de PDF, Markdown o cualquier otro formato específico.

---

# Decisión

El Universal Document Model (UDM) será la representación canónica del conocimiento.

Todos los documentos importados se transformarán al UDM.

Todas las capacidades del sistema operarán exclusivamente sobre el UDM.

Markdown será una representación derivada.

---

# Consecuencias

## Positivas

- Independencia del formato.
- Consistencia.
- Renderizadores múltiples.
- IA uniforme.
- Búsqueda uniforme.

## Negativas

- Mayor complejidad del proceso de importación.

---

# Alternativas consideradas

- PDF como formato interno.
- Markdown como formato interno.
- HTML como formato interno.

Descartadas por limitar la evolución del sistema.
