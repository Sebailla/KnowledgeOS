# Data Model

Versión: 1.0
Estado: Draft

---

# Propósito

Definir el modelo conceptual de persistencia.

No define tablas ni una base de datos concreta.

---

# Objetos persistentes

- Workspace
- Document
- Collection
- Annotation
- Knowledge Object
- Graph Node
- Graph Edge
- Settings

---

# Reglas

- Todo objeto posee un ID inmutable.
- Todo objeto puede versionarse.
- Todo objeto registra fechas de creación y modificación.
- Las relaciones se representan mediante referencias estables.

---

# Principio Fundamental

El modelo de datos es independiente de la tecnología de almacenamiento.
