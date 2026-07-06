# CAP-001 — Universal Import

Versión: 0.1
Estado: Diseño

---

# 1. Propósito

Universal Import permite incorporar conocimiento desde cualquier fuente
externa preservando la mayor cantidad posible de información estructural,
visual y semántica.

El objetivo no consiste en importar archivos.

El objetivo consiste en transformar información externa en conocimiento
nativo de KnowledgeOS.

---

# 2. Objetivos

La importación deberá:

- aceptar múltiples formatos;
- preservar el contenido;
- preservar la estructura lógica;
- reconstruir el diseño visual cuando sea posible;
- conservar los recursos originales;
- mantener la trazabilidad;
- generar un Documento UDM válido;
- enriquecer el contenido cuando corresponda.

---

# 3. Formatos soportados

La arquitectura deberá permitir incorporar, entre otros:

Documentos

- PDF
- PDF escaneado
- EPUB
- Markdown
- DOCX
- HTML
- CHM
- RTF
- ODT
- TXT

Contenido Web

- URL
- Artículo
- Blog
- Wiki

Imágenes

- PNG
- JPG
- TIFF
- HEIC

Otros

- OPML
- LaTeX
- Jupyter Notebook
- ZIP de documentos

---

# 4. Resultado esperado

Toda importación genera un Documento UDM.

Nunca modifica el archivo original.

El archivo original permanece referenciado como fuente.

---

# 5. Principios

La importación es no destructiva.

La importación es reproducible.

La importación conserva evidencia.

Toda transformación es trazable.

---

# 6. Éxito

Una importación se considera exitosa cuando:

- el contenido fue preservado;
- la estructura lógica fue reconstruida;
- el layout fue recuperado cuando corresponde;
- las imágenes fueron vinculadas;
- las referencias permanecen válidas;
- el documento puede representarse mediante cualquier Renderizador.

---

# 7. Resultado para el usuario

Al finalizar la importación el usuario obtiene un Documento listo para:

- leer;
- buscar;
- anotar;
- resumir;
- traducir;
- relacionar;
- exportar;
- estudiar.
