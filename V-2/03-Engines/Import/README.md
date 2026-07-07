
# Import Engine

Versión: 1.0
Estado: Draft

---

# Propósito

El Import Engine es responsable de incorporar contenido externo a KnowledgeOS y convertirlo al Universal Document Model (UDM).

Es el único Engine autorizado para crear nuevos Documents.

---

# Responsabilidades

- Importar documentos.
- Detectar formatos.
- Coordinar el proceso de parsing.
- Construir el UDM.
- Validar el resultado.

---

# No es responsable de

- Renderizar documentos.
- Indexar contenido.
- Extraer conocimiento.
- Persistir datos.

---

# Componentes

- Overview.md
- SupportedFormats.md
- ImportPipeline.md
- ParserArchitecture.md
- Validation.md

---

# Principio Fundamental

Todo documento ingresa a KnowledgeOS a través del Import Engine.
