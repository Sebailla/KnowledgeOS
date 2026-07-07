
# Annotation Engine Overview

Versión: 1.0
Estado: Draft

---

# Propósito

Gestionar el conocimiento explícito creado por el usuario.

---

# Flujo

Document

↓

Select Content

↓

Create Annotation

↓

Storage Engine

↓

Annotation Available

---

# Responsabilidades

- Administrar anotaciones.
- Resolver el anclaje al documento.
- Mantener la consistencia de las referencias.

---

# Eventos publicados

- AnnotationCreated
- AnnotationUpdated
- AnnotationDeleted

---

# Eventos consumidos

- DocumentImported
- DocumentUpdated
- DocumentDeleted

---

# Principio Fundamental

Las anotaciones sobreviven al renderizado y permanecen asociadas al contenido mediante referencias estables.
