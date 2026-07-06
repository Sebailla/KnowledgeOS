
# 04 — Layout Recovery Stage

Parte del Universal Import Pipeline

---

# 1. Propósito

La etapa de Layout Recovery tiene como objetivo reconstruir la organización
visual original del documento a partir del StructuredDocumentModel (SDM) y
del RawDocumentModel (RDM).

Esta etapa no modifica contenido.

Esta etapa no modifica estructura lógica.

Solo reconstruye intención visual.

---

# 2. Entrada

La entrada incluye:

- StructuredDocumentModel (SDM)
- RawDocumentModel (RDM)
- Layout hints (bounding boxes, estilos, tipografía)
- Recursos visuales (imágenes, fuentes, estilos)

---

# 3. Salida

La salida es un **LayoutDocumentModel (LDM)**.

El LDM representa cómo el documento estaba visualmente compuesto.

---

# 4. LayoutDocumentModel (LDM)

El LDM describe la disposición visual del contenido.

Incluye:

## 4.1 Estructura de página

- páginas
- márgenes
- encabezados
- pies de página

---

## 4.2 Sistema de columnas

- número de columnas
- ancho relativo
- separación (gutter)
- flujo de lectura entre columnas

---

## 4.3 Tipografía

- familias tipográficas aproximadas
- tamaños relativos
- jerarquía visual
- peso (bold, regular, italic)

---

## 4.4 Espaciado

- interlineado
- espaciado entre párrafos
- indentaciones
- padding visual

---

## 4.5 Elementos visuales

- imágenes y su posición
- tablas con layout reconstruido
- gráficos
- captions
- notas laterales

---

## 4.6 Flujo visual

El LDM define:

- orden visual de lectura
- agrupación visual de bloques
- jerarquía de foco
- puntos de énfasis

---

# 5. Estrategias de reconstrucción

El Layout Recovery combina múltiples señales:

---

## 5.1 Señales del RDM

- bounding boxes
- coordenadas absolutas
- capas visuales
- proximidad física

---

## 5.2 Señales del SDM

- jerarquía de títulos
- estructura lógica
- tipo de bloque

---

## 5.3 Señales tipográficas inferidas

- tamaños de fuente relativos
- estilos repetidos
- patrones de títulos

---

## 5.4 Señales editoriales

- columnas típicas de papers
- layouts de revistas
- formatos de libros
- estilos técnicos

---

# 6. Reglas

## R-001

El Layout Recovery no modifica contenido textual.

---

## R-002

El Layout Recovery no modifica estructura lógica.

---

## R-003

El Layout Recovery puede inferir estilos con incertidumbre.

---

## R-004

El Layout Recovery debe preservar la intención visual incluso si no puede
reconstruirse perfectamente.

---

## R-005

El Layout Recovery nunca elimina elementos visuales, solo los reubica.

---

# 7. Manejo de incertidumbre

El LDM puede contener múltiples hipótesis de layout:

```text
Option A:
  Two-column layout

Option B:
  Single-column layout with wide margins
```

---

# 8. Ejemplo de LDM

```text
Document Layout:

Pages:
  - Page 1
  - Page 2

Layout:

  Page 1:
    Header: "Medical Study"
    Columns: 2

    Section: Introduction
      Font: Serif 12pt
      Alignment: Justified

    Figure I1:
      Position: right column
      Width: 40%

  Page 2:
    Section: Results
      Columns: 2
      Spacing: large

    Table TB1:
      Full width
      Centered
```

---

# 9. Diferencia con SDM

| SDM (estructura) | LDM (layout)  |
| ---------------- | ------------- |
| capítulos       | páginas      |
| secciones        | columnas      |
| párrafos        | tipografía   |
| orden lógico    | orden visual  |
| contenido        | presentación |

---

# 10. Objetivo de diseño

El Layout Recovery no intenta reproducir el diseño original con precisión
pixel-perfect.

Intenta preservar la intención editorial del documento.

---

# 11. Principio fundamental

El layout es una interpretación visual de la estructura, no una propiedad
del contenido.
