# 01 — Detection Stage

Parte del Universal Import Pipeline

---

# 1. Propósito

La etapa de Detection tiene como objetivo identificar:

- el formato del archivo;
- la naturaleza del contenido;
- el tipo documental;
- el nivel de complejidad estructural;
- la estrategia de procesamiento adecuada.

Esta etapa determina cómo se ejecutará todo el pipeline posterior.

---

# 2. Entrada

La entrada de esta etapa es un recurso sin interpretar:

Ejemplos:

- archivo PDF
- EPUB
- DOCX
- HTML
- CHM
- imagen
- ZIP
- URL

---

# 3. Salida

La salida es un **ImportDescriptor**.

El ImportDescriptor contiene metadatos estructurales:

```text
FormatType:
DocumentType:
ComplexityLevel:
HasOCRNeed:
HasLayout:
HasTables:
HasImages:
HasMath:
HasCode:
LanguageGuess:
EncodingHints:
ConfidenceScore:
RecommendedPipeline:
```

---

# 4. Formatos detectables

## Formato técnico

- PDF digital
- PDF escaneado
- EPUB
- DOCX
- HTML
- CHM
- Imagen
- Texto plano
- Markdown
- Archivo comprimido

---

## Tipo documental

- Libro
- Paper científico
- Revista
- Manual técnico
- Informe médico
- Tesis
- Artículo web
- Presentación
- Dataset documentado

---

# 5. Estrategias de detección

La detección no es un único algoritmo.

Es una combinación de heurísticas:

## 5.1 Análisis de estructura

- presencia de capas de texto
- número de columnas
- metadatos PDF
- estructura DOM (HTML)
- estilo tipográfico

---

## 5.2 Análisis visual

- densidad de texto
- presencia de imágenes
- layout regular vs irregular
- patrones de columnas

---

## 5.3 Análisis semántico inicial

- títulos repetidos
- patrones académicos (abstract, references)
- indicadores de libro o paper

---

## 5.4 OCR necessity detection

- ausencia de texto embebido
- texto como imagen
- baja extractabilidad

---

# 6. Output: ImportDescriptor

Ejemplo:

```text
FormatType: PDF
DocumentType: ScientificPaper
ComplexityLevel: High
HasOCRNeed: False
HasLayout: True
HasTables: True
HasImages: True
HasMath: True
HasCode: True
LanguageGuess: English
EncodingHints: UTF-8
ConfidenceScore: 0.94
RecommendedPipeline:
  - StructureExtraction
  - LayoutRecovery
  - SemanticAnalysis
```

---

# 7. Reglas

## R-001

Detection no modifica el archivo.

---

## R-002

Detection no extrae contenido completo.

---

## R-003

Detection no realiza OCR completo.

---

## R-004

Detection debe ser rápida.

---

## R-005

Detection puede ser probabilística.

---

# 8. Errores

Si la confianza es baja:

- se marca como "Unknown Type"
- se habilita pipeline conservador
- se prioriza preservación sobre interpretación

---

# 9. Principio fundamental

La Detection Stage no intenta ser perfecta.

Intenta ser suficientemente buena para elegir el pipeline correcto.
