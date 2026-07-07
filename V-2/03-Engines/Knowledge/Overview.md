# Knowledge Engine Overview

Versión: 1.0
Estado: Draft

---

# Propósito

Construir y mantener una representación estructurada del conocimiento contenido en un Workspace.

---

# Entradas

- Documents (UDM)
- Annotations

---

# Salidas

- Knowledge Objects
- Relaciones de conocimiento

---

# Responsabilidades

- Crear objetos de conocimiento.
- Actualizar objetos existentes.
- Eliminar objetos obsoletos.
- Mantener consistencia.

---

# Eventos publicados

- KnowledgeCreated
- KnowledgeUpdated
- KnowledgeDeleted

---

# Eventos consumidos

- ImportCompleted
- AnnotationCreated
- AnnotationUpdated
- AnnotationDeleted

---

# Principio Fundamental

El Knowledge Engine administra conocimiento explícito, no la representación visual del contenido.
