
# C4 Level 3 – Import Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Incorporar información externa a KnowledgeOS y convertirla al Universal Document Model (UDM).

El Import Engine constituye la única puerta de entrada de contenido nuevo al sistema.

---

# Responsabilidades

- Importar documentos.
- Detectar el tipo de archivo.
- Ejecutar OCR cuando sea necesario.
- Extraer texto.
- Extraer imágenes.
- Extraer tablas.
- Extraer metadata.
- Detectar la estructura lógica del documento.
- Convertir el contenido al UDM.
- Validar el resultado antes de incorporarlo a la Library.

---

# No es responsable de

- Persistencia.
- Organización de la biblioteca.
- Búsqueda.
- IA.
- Renderizado.
- Exportación.
- Sincronización.

---

# Componentes

## Import Service

API pública del Engine.

---

## File Detector

Identifica el formato del documento.

Ejemplos:

- PDF
- EPUB
- DOCX
- HTML
- Markdown
- TXT
- CHM

---

## Parser Manager

Selecciona el parser adecuado para cada formato.

---

## OCR Adapter

Invoca el motor OCR cuando el documento no contiene texto.

---

## Metadata Extractor

Extrae:

- título
- autor
- idioma
- fechas
- palabras clave
- propiedades del documento

---

## Structure Analyzer

Reconstruye la estructura lógica del documento.

Detecta:

- capítulos
- secciones
- títulos
- listas
- tablas
- figuras
- notas
- referencias

---

## UDM Builder

Construye el Universal Document Model.

---

## Validation Service

Verifica que el UDM sea consistente antes de entregarlo.

---

## Event Publisher

Publica eventos del proceso de importación.

---

# Flujo

1. Recibir documento.
2. Detectar formato.
3. Seleccionar parser.
4. Ejecutar OCR si corresponde.
5. Extraer contenido.
6. Analizar estructura.
7. Extraer metadata.
8. Construir UDM.
9. Validar.
10. Solicitar al Library Engine la incorporación del documento.

---

# Eventos publicados

- ImportStarted
- ImportCompleted
- ImportFailed
- OCRCompleted
- MetadataExtracted
- UDMCreated

---

# Contratos Públicos

- ImportDocument
- ReimportDocument
- ValidateImport
- ExtractMetadata

---

# Reglas

1. Nunca modifica la Library directamente.
2. Nunca persiste información.
3. Todo documento importado genera un UDM válido.
4. Todo error debe ser recuperable.
5. El documento original nunca es modificado.

---

# Dependencias

- OCR
- Parsers
- File System
- Library Engine (contratos públicos)

---

# Decisiones Congeladas

1. Todo documento pasa por el Import Engine.
2. El UDM es obligatorio para cualquier documento.
3. La persistencia pertenece exclusivamente al Library Engine.
4. OCR es un adaptador externo.
