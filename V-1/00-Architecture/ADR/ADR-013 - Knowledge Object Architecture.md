
# ADR-013 – Native Knowledge Object Format

Status: Accepted

Version: 1.0

---

# Context

KnowledgeOS necesita un formato nativo para almacenar cualquier objeto de conocimiento.

Actualmente existen múltiples formatos de entrada:

- PDF
- EPUB
- DOCX
- HTML
- Markdown
- CHM
- TXT
- Web
- Email
- Chat
- etc.

El núcleo del sistema no debe depender de ninguno de ellos.

---

# Decision

KnowledgeOS adopta un formato nativo denominado **Knowledge Object (.kdoc)**.

Un archivo `.kdoc` representa un único objeto de conocimiento.

Internamente es una base de datos SQLite.

---

# Propiedades

- Portable
- Transaccional
- Versionable
- Offline First
- Independiente del sistema operativo
- Independiente del lenguaje
- Independiente del importador

---

# Contenido

Un `.kdoc` contiene:

- Identity
- UDM
- Layout
- Style
- Knowledge Layer
- Annotations
- Provenance
- History
- Metadata

Los recursos binarios se almacenan externamente.

---

# Consecuencias

Todo el sistema trabaja exclusivamente sobre `.kdoc`.

Los formatos originales pasan a ser únicamente formatos de importación.

El `.kdoc` constituye el formato oficial de KnowledgeOS.
