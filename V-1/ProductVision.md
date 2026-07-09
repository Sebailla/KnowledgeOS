
# Product Vision

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# 1. Propósito

## Objetivo

KnowledgeOS es una plataforma de gestión del conocimiento personal cuyo núcleo es un Universal Document Model (UDM).

Todos los documentos importados se transforman a dicho modelo para proporcionar una experiencia uniforme de lectura, anotación, búsqueda, organización e inteligencia artificial, independientemente del formato de origen.

---

# 2. Visión

Crear la mejor plataforma para leer, comprender, organizar y relacionar conocimiento.

KnowledgeOS no pretende ser únicamente un lector de documentos ni un editor Markdown.

Su objetivo es convertirse en el lugar donde vive el conocimiento del usuario.

---

# 3. Problema

Actualmente el conocimiento está distribuido entre múltiples formatos y aplicaciones.

Ejemplos:

- PDF
- EPUB
- CHM
- DOCX
- HTML
- Markdown
- TXT
- Imágenes
- Notas manuscritas

Cada formato utiliza herramientas diferentes.

Las anotaciones, la búsqueda, la IA y la organización no comparten un modelo común.

---

# 4. Definición del producto

KnowledgeOS es una plataforma de conocimiento personal basada en un Universal Document Model (UDM).

Todos los formatos de entrada son transformados al UDM.

Todas las capacidades del sistema operan exclusivamente sobre el UDM.

Los formatos originales permanecen como referencia.

---

# 5. Usuarios objetivo

## Primarios

- Investigadores
- Médicos
- Estudiantes
- Docentes
- Ingenieros
- Abogados
- Desarrolladores

## Secundarios

Cualquier persona que gestione una biblioteca personal de conocimiento.

---

# 6. Principios

## 6.1 El conocimiento es independiente del formato

Los formatos originales únicamente representan la forma de importar conocimiento.

---

## 6.2 Existe un único documento lógico

Todas las vistas representan exactamente el mismo documento.

---

## 6.3 Las anotaciones pertenecen al contenido

Nunca pertenecen a una página.

Nunca pertenecen a una coordenada.

Siempre pertenecen al contenido.

---

## 6.4 Offline First

Todas las funciones esenciales deben funcionar sin Internet.

---

## 6.5 Privacidad por defecto

Los documentos pertenecen exclusivamente al usuario.

---

## 6.6 La IA es una capacidad

La IA mejora el producto.

No define el producto.

---

## 6.7 El contenido es inmutable

El contenido importado nunca se modifica.

Toda interacción del usuario genera nuevas capas.

---

# 7. Modelo conceptual

KnowledgeOS se compone de tres modelos independientes.

## Universal Document Model (UDM)

Representa el conocimiento.

## Layout Model

Representa la organización visual del documento original.

## Annotation Model

Representa todas las anotaciones realizadas por el usuario.

Los tres modelos evolucionan independientemente.

---

# 8. Universal Document Model

El UDM representa el contenido mediante objetos.

Ejemplos:

- Document
- Chapter
- Section
- Paragraph
- Heading
- List
- Table
- Figure
- Image
- Formula
- Code Block
- Reference
- Footnote

Cada objeto posee:

- UUID permanente
- tipo
- relaciones
- metadatos

El UDM nunca representa elementos de interfaz.

---

# 9. Biblioteca

La biblioteca es una base documental.

No es una carpeta.

La biblioteca administra:

- documentos
- assets
- anotaciones
- índices
- metadatos

---

## Documento original

El archivo original:

- nunca se modifica
- nunca se mueve
- nunca se sobrescribe

Permanece siempre en su ubicación original.

---

## Source of Truth

Cada biblioteca posee una única Source of Truth.

Inicialmente será un NAS.

En el futuro podrá ser:

- almacenamiento local
- NAS
- nube

---

# 10. Workspace

Un Workspace organiza el conocimiento de una biblioteca.

Puede contener:

- colecciones
- carpetas virtuales
- etiquetas
- filtros
- búsquedas guardadas

Los documentos pertenecen a la biblioteca.

El Workspace únicamente los organiza.

---

# 11. Assets

Los recursos asociados a un documento se administran de forma independiente.

Ejemplos:

- imágenes
- miniaturas
- audio
- vídeo
- PDF original
- OCR auxiliar

Los Assets no forman parte del UDM.

---

# 12. Flujo de importación

Todo documento importado sigue el mismo proceso.

Documento original

↓

Preprocesamiento

↓

Extracción

↓

OCR (si corresponde)

↓

Análisis estructural

↓

Reconstrucción

↓

Universal Document Model

↓

Layout Model

↓

Indexación

↓

Representaciones derivadas

---

Las representaciones derivadas pueden incluir:

- Markdown
- HTML
- PDF
- Texto
- Exportaciones

El UDM es siempre la representación canónica.

---

# 13. Layout Model

El Layout Model representa la estructura visual del documento original.

Permite reconstruir:

- libros
- revistas
- papers
- manuales
- documentación técnica

Almacena:

- jerarquía visual
- flujo de lectura
- columnas
- geometría
- relaciones

---

# 14. Sistema de renderizado

Todos los renderizadores utilizan exclusivamente el UDM.

Renderizadores iniciales:

- Editor
- Libro
- Revista
- Paper
- Web

Cambiar de renderizador nunca modifica el documento.

---

# 15. Sistema de anotaciones

Las anotaciones pertenecen al Annotation Model.

Tipos iniciales:

- Highlight
- Ink
- Sticky Note
- Text Note
- Bookmark

Todas las anotaciones permanecen independientemente del renderizador utilizado.

---

## Highlight

Características:

- colores pastel
- colores normales
- colores fluorescentes
- transparencia configurable
- adaptación automática al tema

Modelo de color:

OKLCH

---

## Sticky Notes

Las notas podrán ser:

- manuscritas
- teclado

Las notas escritas podrán utilizar tipografía manuscrita.

---

# 16. Inteligencia Artificial

La IA opera exclusivamente sobre el UDM.

Funciones previstas:

- preguntas
- resúmenes
- búsqueda semántica
- mapas conceptuales
- relaciones
- explicación contextual
- utilización de anotaciones

Toda función IA podrá deshabilitarse sin afectar al funcionamiento del sistema.

---

# 17. Extensibilidad

KnowledgeOS será extensible mediante módulos.

Tipos previstos:

- Importadores
- Exportadores
- Renderizadores
- Motores OCR
- Modelos IA
- Herramientas

---

# 18. No objetivos

KnowledgeOS no pretende ser:

- un editor Markdown
- un visor PDF
- un procesador de texto
- un IDE
- una copia de Obsidian
- una copia de Notion
- una copia de GoodNotes

---

# 19. Roadmap

## Fase 1

Core Platform

- Biblioteca
- UDM
- Importación
- Renderizado
- Anotaciones

---

## Fase 2

Reading Experience

- Apple Pencil
- Layout avanzado
- OCR avanzado

---

## Fase 3

Knowledge Intelligence

- IA
- Búsqueda semántica
- Relaciones
- Embeddings

---

## Fase 4

Platform Ecosystem

- Plugins
- Sincronización
- Colaboración
- API pública

---

# 20. Glosario

## KnowledgeOS

Plataforma de gestión del conocimiento personal.

## UDM

Universal Document Model.

Representación canónica del conocimiento.

## Layout Model

Representación del diseño visual original.

## Annotation Model

Representación de todas las anotaciones.

## Library

Base documental.

## Workspace

Organización lógica de una biblioteca.

## Asset

Recurso asociado a un documento.

## Source of Truth

Ubicación principal de la biblioteca.

## Renderer

Componente encargado de visualizar el UDM.

## Import Pipeline

Proceso de transformación desde cualquier formato al UDM.

---

# Decisiones congeladas

1. El UDM es el núcleo del sistema.
2. El UDM es la única representación canónica del conocimiento.
3. Markdown deja de ser el formato interno principal y pasa a ser una representación derivada.
4. Todo documento importado genera un UDM.
5. El documento original nunca se modifica.
6. Las anotaciones pertenecen al contenido.
7. El contenido es inmutable.
8. El sistema es Offline First.
9. La IA es una capacidad del producto.
10. El Layout Model es independiente del UDM.
11. El Annotation Model es independiente del UDM.
12. Todos los renderizadores utilizan el mismo UDM.
13. El sistema de resaltado utilizará OKLCH.
14. La biblioteca tendrá una única Source of Truth.
15. El NAS será la Source of Truth inicial.
