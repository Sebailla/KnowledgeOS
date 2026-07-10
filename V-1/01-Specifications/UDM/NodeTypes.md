
# UDM Node Types

Version: 1.0

Status: Draft

---

# Objetivo

Definir todos los nodos que pueden existir dentro del Universal Document Model.

Todo documento estará compuesto exclusivamente por estos nodos.

No existen nodos fuera de esta especificación.

---

# Jerarquía

Node

├── BlockNode
├── InlineNode
├── AssetNode
├── StructuralNode
├── SemanticNode
└── AnnotationNode

---

# Block Nodes

Representan bloques del documento.

## Document

Raíz del árbol.

Cardinalidad

1

---

## Chapter

Capítulo.

Puede contener

Section

Paragraph

Figure

Table

Callout

---

## Section

Sección.

Puede contener

Section

Paragraph

Figure

Table

List

---

## Heading

Atributos

level

text

id

---

## Paragraph

Atributos

text

style

alignment

---

## Quote

Atributos

text

author

citation

---

## Callout

Tipos

Info

Warning

Success

Danger

Tip

Note

---

## List

Tipos

Ordered

Unordered

Checklist

Definition

---

## ListItem

Puede contener

Paragraph

List

CodeBlock

Table

Image

---

## Table

Contiene

Rows

---

## TableRow

Contiene

Cells

---

## TableCell

Puede contener cualquier BlockNode.

---

## CodeBlock

Atributos

language

code

filename

---

## Formula

Atributos

latex

mathml

---

## Figure

Contiene

Image

Caption

---

## Caption

Texto descriptivo.

---

## HorizontalRule

Separador.

---

## PageBreak

Cambio de página.

---

# Inline Nodes

Representan contenido dentro de un párrafo.

## Text

Texto plano.

---

## Strong

Negrita.

---

## Emphasis

Cursiva.

---

## Underline

Subrayado.

---

## Strike

Texto tachado.

---

## Superscript

Superíndice.

---

## Subscript

Subíndice.

---

## Link

Atributos

url

title

---

## InternalLink

Referencia interna.

---

## Citation

Referencia bibliográfica.

---

## InlineCode

Código inline.

---

## FormulaInline

Fórmula inline.

---

# Asset Nodes

## Image

Atributos

assetId

width

height

dpi

alt

---

## Video

assetId

duration

codec

---

## Audio

assetId

duration

codec

---

## Attachment

assetId

filename

mime

---

# Structural Nodes

## Header

---

## Footer

---

## Page

---

## Column

---

## Region

---

## Margin

---

## Float

---

# Semantic Nodes

## Entity

Persona

Lugar

Organización

Medicamento

Especie

Concepto

---

## Topic

Tema principal.

---

## Keyword

Palabra clave.

---

## Summary

Resumen IA.

---

## Embedding

Vector.

---

## Classification

Clasificación automática.

---

## ReadingProgress

Estado de lectura.

---

# Annotation Nodes

## Highlight

---

## Bookmark

---

## Ink

---

## StickyNote

---

## TextNote

---

## Comment

---

## Arrow

---

## Shape

Rectangle

Ellipse

Polygon

Freehand

---

# Relaciones

Todos los nodos pueden relacionarse mediante:

Contains

Parent

Child

Previous

Next

Reference

SemanticReference

Annotation

---

# Restricciones

Un nodo tiene un único padre.

No existen ciclos.

Todo nodo posee UUID.

Todo nodo posee orden.

Todo nodo posee tipo.

Todo nodo puede serializarse.

---

# Reglas

1. Los nodos son inmutables.
2. El contenido nunca depende del renderizador.
3. El layout nunca modifica el contenido.
4. Las anotaciones nunca modifican el contenido.
5. La capa semántica nunca modifica el contenido.
6. Todo documento es un árbol de nodos enriquecido por capas adicionales.
