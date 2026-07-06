
# 03 — Structure Recovery Stage

Parte del Universal Import Pipeline

---

# 1. Propósito

La etapa de Structure Recovery tiene como objetivo reconstruir la estructura
lógica del documento a partir del RawDocumentModel.

Esta etapa transforma información fragmentada en una jerarquía coherente.

No interpreta significado profundo.

No modifica contenido.

Solo organiza.

---

# 2. Entrada

La entrada es un RawDocumentModel (RDM).

Incluye:

- bloques de texto
- posiciones espaciales
- páginas
- encabezados detectados
- imágenes
- tablas
- metadatos

---

# 3. Salida

La salida es un **StructuredDocumentModel (SDM)**.

El SDM representa la estructura lógica del documento.

---

# 4. StructuredDocumentModel (SDM)

El SDM organiza el contenido en una jerarquía coherente.

Contiene:

## 4.1 Document Root

- título
- tipo de documento
- metadatos consolidados

---

## 4.2 Secciones

- capítulos
- subcapítulos
- secciones anidadas

Ejemplo:

```text
Chapter 1
  ├── 1.1 Introduction
  ├── 1.2 Background
  └── 1.3 Objectives
```

---

## 4.3 Bloques de contenido

- párrafos
- listas
- citas
- ecuaciones
- código

---

## 4.4 Elementos estructurales especiales

- tablas
- figuras
- referencias
- notas al pie

---

## 4.5 Orden de lectura

El SDM define:

- flujo lógico
- secuencia de lectura
- jerarquía de contenido

---

# 5. Estrategias de reconstrucción

La Structure Recovery combina múltiples señales:

---

## 5.1 Señales tipográficas

- tamaño de fuente
- negrita
- espaciado
- mayúsculas
- estilo de título

---

## 5.2 Señales espaciales

- proximidad entre bloques
- alineación
- columnas
- agrupación visual

---

## 5.3 Señales semánticas débiles

- palabras clave ("Introduction", "Conclusion", "Abstract")
- numeración (1, 1.1, 2.3)
- patrones académicos

---

## 5.4 Señales de consistencia

- repetición de estilos
- patrones de encabezados
- estructuras regulares

---

# 6. Reglas

## R-001

Structure Recovery no modifica contenido textual.

---

## R-002

Structure Recovery no interpreta significado profundo.

---

## R-003

Structure Recovery puede inferir jerarquía con incertidumbre.

---

## R-004

Toda estructura inferida debe poder justificarse por señales observables.

---

## R-005

Si existe ambigüedad, se preservan múltiples hipótesis.

---

# 7. Manejo de ambigüedad

El SDM puede contener estructuras alternativas:

```text
Option A:
  Chapter 1
    - Section A

Option B:
  Chapter 1
  Chapter 2 (merged detection)
```

El sistema no fuerza una única interpretación cuando no es confiable.

---

# 8. Ejemplo de SDM

```text
Document:
  Title: "Medical Study on Hyponatremia"

Sections:

  1. Introduction
     - Paragraphs: T1, T2

  2. Methods
     - Paragraphs: T3, T4
     - Table: TB1

  3. Results
     - Paragraphs: T5, T6
     - Figure: I1

  4. Discussion
     - Paragraphs: T7

  5. Conclusion
     - Paragraph: T8
```

---

# 9. Diferencia con Extraction

| Extraction (RDM) | Structure Recovery (SDM) |
| ---------------- | ------------------------ |
| datos crudos     | organización lógica    |
| bloques sueltos  | jerarquía coherente     |
| incertidumbre    | hipótesis estructural   |
| layout parcial   | estructura reconstruida  |

---

# 10. Objetivo de diseño

El SDM no intenta ser perfecto.

Intenta ser la mejor aproximación posible a la intención estructural del
autor.

---

# 11. Principio fundamental

La estructura no es el contenido.

La estructura es una interpretación organizativa del contenido.
