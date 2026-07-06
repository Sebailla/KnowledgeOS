
# 02 — Extraction Stage

Parte del Universal Import Pipeline

---

# 1. Propósito

La etapa de Extraction tiene como objetivo convertir el archivo detectado en una representación interna intermedia que preserve:

- contenido textual
- estructura lógica
- estructura visual (parcial)
- recursos embebidos
- metadatos relevantes

Esta etapa NO genera todavía UDM.

Esta etapa NO interpreta semántica profunda.

---

# 2. Entrada

La entrada es un ImportDescriptor + archivo original.

Ejemplo:

- PDF digital
- PDF escaneado
- EPUB
- DOCX
- HTML
- CHM

---

# 3. Salida

La salida es un **RawDocumentModel (RDM)**.

El RDM es una representación neutral del documento.

---

# 4. RawDocumentModel (RDM)

El RDM es un modelo intermedio que preserva fidelidad antes de cualquier
interpretación.

Contiene:

## 4.1 Texto bruto

- bloques de texto extraídos
- orden aproximado de lectura
- offsets internos si existen

---

## 4.2 Estructura primaria

- páginas (si existen)
- secciones detectadas
- encabezados aproximados
- pies de página
- columnas aproximadas

---

## 4.3 Recursos

- imágenes extraídas
- gráficos
- tablas como entidades separadas
- fuentes si es posible

---

## 4.4 Layout hints

- coordenadas (bounding boxes)
- relaciones espaciales
- capas visuales
- alineaciones

---

## 4.5 Metadata heredada

- autor
- título
- fecha
- encoding
- idioma probable

---

# 5. Tipos de extracción

## 5.1 Text-based extraction

Para:

- PDF digital
- DOCX
- HTML
- EPUB

Se prioriza:

- estructura lógica
- orden de lectura
- semántica básica de bloques

---

## 5.2 OCR-based extraction

Para:

- PDF escaneado
- imágenes
- documentos sin texto embebido

Incluye:

- reconocimiento de texto
- reconstrucción de líneas
- agrupación en bloques
- estimación de estructura

---

## 5.3 Hybrid extraction

Para documentos mixtos:

- PDF con imágenes + texto
- revistas escaneadas parcialmente
- papers con figuras complejas

---

# 6. Reglas

## R-001

Extraction nunca elimina información.

---

## R-002

Extraction puede duplicar información si mejora la fidelidad.

---

## R-003

Extraction no interpreta significado.

---

## R-004

Extraction no genera relaciones semánticas.

---

## R-005

Extraction preserva incertidumbre explícitamente.

---

# 7. Representación de incertidumbre

El RDM puede contener:

```text
TextBlock:
  content: "..."
  confidence: 0.82
```

```text
LayoutBlock:
  type: "paragraph"
  confidence: 0.74
```

Esto es clave para etapas posteriores.

---

# 8. Ejemplo de RDM

```text
Document:
  type: ScientificPaper

Pages:
  - Page 1
  - Page 2

TextBlocks:
  - id: T1
    content: "Introduction..."
    page: 1
    confidence: 0.98

  - id: T2
    content: "Results..."
    page: 2
    confidence: 0.95

Images:
  - id: I1
    type: figure
    boundingBox: [x1, y1, x2, y2]

Tables:
  - id: TB1
    structure: semi-detected
    confidence: 0.80
```

---

# 9. Objetivo de diseño

El RDM no es bonito.

El RDM no es final.

El RDM es un **buffer de máxima fidelidad** entre el archivo y el conocimiento.

---

# 10. Principio fundamental

La Extraction Stage no decide qué es importante.

Solo preserva lo que existe.
