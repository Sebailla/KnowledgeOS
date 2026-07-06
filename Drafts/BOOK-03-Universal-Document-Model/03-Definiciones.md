
# 3. Definiciones

## 3.1 Introducción

Este documento establece el significado formal de los términos utilizados
en el Universal Document Model (UDM).

Todas las definiciones aquí contenidas son normativas.

Ningún término deberá utilizarse con un significado diferente en otros
libros de la Product Bible.

---

# 3.2 Conocimiento

Conocimiento es información organizada, contextualizada y susceptible de
ser comprendida, relacionada y reutilizada.

El conocimiento constituye el elemento principal administrado por
KnowledgeOS.

El conocimiento no depende de un formato de archivo.

El conocimiento puede representarse mediante múltiples formatos sin
alterar su significado.

---

# 3.3 Documento

Un Documento es un conjunto organizado de objetos pertenecientes al
Universal Document Model.

Un documento representa una unidad lógica de conocimiento.

Un documento puede originarse a partir de uno o varios archivos.

Ejemplos:

• PDF

• EPUB

• CHM

• Markdown

• HTML

• DOCX

• TXT

• Imagen escaneada

• Página Web

Una vez importado, el documento deja de depender del formato original.

---

# 3.4 Archivo Original

Archivo Original es el recurso externo utilizado para crear un Documento.

El Archivo Original nunca constituye la fuente principal de información
del sistema.

El Archivo Original deberá conservarse sin modificaciones.

Su utilización queda limitada a:

• auditoría

• reimportación

• comparación

• verificación

---

# 3.5 Objeto

Un Objeto es la unidad mínima persistente administrada por el UDM.

Todo Objeto deberá poseer identidad propia.

Todo Objeto podrá relacionarse con otros Objetos.

Todo Objeto podrá evolucionar independientemente.

Todo Objeto deberá poder persistirse individualmente.

---

# 3.6 Identificador

Todo Objeto deberá poseer un Identificador Global Único (GUID).

El identificador nunca deberá reutilizarse.

El identificador nunca dependerá de la posición del objeto.

El identificador permanecerá estable durante toda la vida del Objeto.

---

# 3.7 Contenido

Contenido representa la información significativa administrada por un
Objeto.

Ejemplos:

• texto

• imagen

• tabla

• ecuación

• código fuente

• audio

• vídeo

• dibujo

El contenido es independiente de su representación visual.

---

# 3.8 Estructura

La Estructura representa la organización lógica de un Documento.

Ejemplos:

• capítulos

• secciones

• subsecciones

• párrafos

• listas

• tablas

• figuras

La estructura nunca dependerá del diseño visual.

---

# 3.9 Layout

Layout representa la organización visual original de un documento.

Ejemplos:

• columnas

• márgenes

• encabezados

• pie de página

• alineación

• posiciones relativas

El Layout es una propiedad del documento.

No constituye el documento.

---

# 3.10 Renderizador

Un Renderizador es un componente encargado de representar un Documento.

El Renderizador consume Objetos UDM.

Nunca consume directamente archivos.

El mismo Documento podrá ser representado simultáneamente por múltiples
Renderizadores.

---

# 3.11 Vista

Una Vista es el resultado producido por un Renderizador.

Ejemplos:

• Libro

• Revista

• Paper

• Editor

• Página Web

• Presentación

Cambiar de Vista nunca modifica el Documento.

---

# 3.12 Biblioteca

La Biblioteca es el conjunto de Documentos administrados por
KnowledgeOS.

La Biblioteca organiza conocimiento.

No organiza archivos.

---

# 3.13 Colección

Una Colección es una agrupación lógica de Documentos.

Las Colecciones son virtuales.

Un Documento podrá pertenecer simultáneamente a múltiples Colecciones.

---

# 3.14 Anotación

Una Anotación es información agregada por el usuario sin modificar el
contenido original.

Ejemplos:

• resaltado

• subrayado

• nota

• dibujo

• audio

• marcador

Las Anotaciones deberán mantenerse estables independientemente de la
Vista utilizada.

---

# 3.15 Ancla

Un Ancla representa el mecanismo utilizado para asociar una Anotación a
un Objeto.

Las Anclas nunca dependerán de coordenadas de pantalla.

Las Anclas deberán sobrevivir a cambios de:

• tipografía

• tamaño

• zoom

• renderer

• dispositivo

---

# 3.16 Recurso

Un Recurso representa cualquier elemento binario utilizado por un
Documento.

Ejemplos:

• imágenes

• vídeos

• audios

• archivos adjuntos

Los Recursos son Objetos independientes.

---

# 3.17 Relación

Una Relación expresa un vínculo semántico o estructural entre dos
Objetos.

Toda Relación posee:

• origen

• destino

• tipo

• metadatos

Las Relaciones son direccionadas.

---

# 3.18 Versión

Una Versión representa un estado histórico de un Objeto.

Las Versiones permiten reconstruir la evolución completa de un Objeto.

---

# 3.19 Semántica

La Semántica representa el significado inferido o declarado de un
Objeto.

Ejemplos:

• entidades

• conceptos

• referencias

• palabras clave

• temas

La Semántica podrá ser generada automáticamente o manualmente.

---

# 3.20 Objeto Persistente

Todo Objeto administrado por KnowledgeOS deberá ser persistente.

La persistencia no implica almacenamiento permanente.

Implica que el Objeto puede reconstruirse completamente a partir de la
información almacenada.

---

# 3.21 Definición Fundamental

Todo elemento administrado por KnowledgeOS será representado mediante un
Objeto definido por el Universal Document Model.

Esta definición constituye la base de toda la arquitectura del sistema.
