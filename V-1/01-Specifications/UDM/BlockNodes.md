# UDM Block Nodes

Version: 1.0

Status: Draft

---

# Objetivo

Definir todos los nodos de bloque del Universal Document Model.

Los Block Nodes representan la estructura lógica del documento.

Nunca representan aspectos visuales.

---

# Jerarquía

BlockNode

├── Document
├── Chapter
├── Section
├── Heading
├── Paragraph
├── Quote
├── Callout
├── List
├── ListItem
├── Table
├── TableRow
├── TableCell
├── Figure
├── Caption
├── CodeBlock
├── Formula
├── HorizontalRule
└── PageBreak

---

# Document

Raíz del árbol.

Cardinalidad

exactamente uno.

Puede contener

- Chapter
- Section
- Paragraph
- Figure
- Table

---

# Chapter

Representa un capítulo.

Puede contener cualquier BlockNode.

---

# Section

Representa una sección.

Puede contener cualquier BlockNode.

Puede anidarse.

---

# Heading

Atributos

id

level

text

slug

---

# Paragraph

Representa texto continuo.

Puede contener únicamente Inline Nodes.

---

# Quote

Representa una cita.

Atributos

text

author

source

---

# Callout

Representa bloques destacados.

Tipos

Info

Note

Warning

Danger

Success

Tip

---

# List

Tipos

Ordered

Unordered

Checklist

Definition

---

# ListItem

Puede contener

Paragraph

List

Table

Figure

CodeBlock

---

# Table

Representa una tabla lógica.

No contiene información visual.

---

# TableRow

Representa una fila.

---

# TableCell

Puede contener cualquier BlockNode.

---

# Figure

Agrupa recursos visuales.

Puede contener

Image

Caption

Video

Audio

---

# Caption

Texto descriptivo.

---

# CodeBlock

Atributos

language

filename

code

---

# Formula

Representa expresiones matemáticas.

Formato

LaTeX

MathML

---

# HorizontalRule

Separador lógico.

---

# PageBreak

Marca un salto de página del documento original.

No implica salto durante el render.
