
# Logical and Physical Document

Version: 1.0

Status: Draft

---

# Objetivo

Separar el documento lógico de los archivos físicos originales.

---

# Physical Document

Representa un archivo de origen.

Ejemplos:

- PDF
- EPUB
- DOCX
- CHM
- HTML
- Markdown
- TXT

Un Physical Document nunca se modifica.

---

# Logical Document

Representa el documento dentro de KnowledgeOS.

Un Logical Document puede originarse desde uno o más Physical Documents.

Ejemplo:

Libro.pdf

Libro.epub

Libro.docx

↓

Logical Document

↓

UDM

---

# Reglas

1. El usuario trabaja sobre el Logical Document.
2. El archivo original permanece fuera del sistema.
3. Un Logical Document posee un único UDM activo.
4. Un Physical Document puede reimportarse.
5. Un Logical Document mantiene referencia a todos sus orígenes.
