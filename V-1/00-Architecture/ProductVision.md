
# Product Vision

**Proyecto:** KnowledgeOS
**Versión:** 2.0
**Estado:** Congelado
**Documento reemplazado:** ProductVision v1.0

---

# 1. Propósito

KnowledgeOS es una plataforma personal para importar, preservar, organizar, leer, anotar, relacionar, buscar y comprender conocimiento.

Su propósito es ofrecer una experiencia uniforme sobre información proveniente de formatos, fuentes y dispositivos diferentes, sin depender del archivo original ni de una aplicación específica.

KnowledgeOS debe permitir que el usuario mantenga control permanente sobre sus datos y trabaje con ellos incluso sin conexión.

---

# 2. Visión

Crear un sistema operativo personal para el conocimiento.

KnowledgeOS será el lugar donde el usuario pueda:

* incorporar conocimiento desde múltiples fuentes;
* conservar su estructura y procedencia;
* leerlo mediante distintas representaciones;
* agregar anotaciones independientes del formato;
* relacionarlo con otros elementos;
* buscarlo de forma textual, estructural y semántica;
* utilizar inteligencia artificial de manera opcional;
* acceder desde macOS, iPad y iPhone;
* conservar la biblioteca bajo su propio control.

---

# 3. Problema

El conocimiento personal suele estar fragmentado entre:

* PDF;
* EPUB;
* DOCX;
* CHM;
* HTML;
* Markdown;
* imágenes;
* páginas web;
* notas;
* anotaciones manuscritas;
* conversaciones con inteligencia artificial;
* aplicaciones incompatibles entre sí.

Cada formato utiliza modelos diferentes para almacenar contenido, layout, anotaciones, búsqueda y metadatos.

Esto provoca:

* dependencia de aplicaciones específicas;
* anotaciones aisladas;
* pérdida de contexto;
* duplicación de información;
* dificultad para buscar entre fuentes;
* dificultad para relacionar conocimiento;
* imposibilidad de cambiar la presentación sin perder anotaciones;
* dependencia innecesaria de servicios remotos.

---

# 4. Definición del producto

KnowledgeOS es una plataforma de gestión del conocimiento personal basada en cuatro conceptos centrales:

```text
Knowledge Object
        │
        ├── .kdoc
        ├── UDM
        ├── Assets
        └── Metadata
                │
                ▼
        Knowledge Graph
```

## Knowledge Object

Es la unidad persistente fundamental de KnowledgeOS.

Representa cualquier unidad autónoma de conocimiento administrada por la biblioteca.

Ejemplos:

* libro;
* paper;
* manual;
* nota;
* página web;
* conversación con IA;
* correo electrónico importado;
* notebook;
* documento técnico.

Un documento es un tipo de Knowledge Object, no la unidad universal del sistema.

## `.kdoc`

Es el formato nativo de persistencia de un Knowledge Object.

Internamente utiliza SQLite y contiene la información estructurada, transaccional y versionada del objeto.

## Universal Document Model

El Universal Document Model, o UDM, representa el contenido lógico y estructurado de un Knowledge Object.

No representa el objeto persistente completo.

## Knowledge Graph

Representa relaciones entre Knowledge Objects, nodos del UDM, conceptos, entidades, referencias y anotaciones.

Es un modelo derivado y reconstruible.

---

# 5. Usuarios objetivo

## Usuarios primarios

* investigadores;
* médicos y otros profesionales sanitarios;
* estudiantes;
* docentes;
* abogados;
* ingenieros;
* desarrolladores;
* profesionales que trabajan con documentación extensa.

## Usuarios secundarios

Cualquier persona que necesite conservar, estudiar, organizar y relacionar una biblioteca personal de conocimiento.

---

# 6. Plataformas

## macOS

Plataforma principal para:

* gestión completa de la biblioteca;
* importación;
* procesamiento;
* edición;
* organización;
* búsqueda;
* inteligencia artificial;
* administración de plugins.

## iPad

Plataforma principal para:

* lectura;
* resaltado;
* Apple Pencil;
* anotaciones manuscritas;
* notas visuales;
* revisión de documentos.

## iPhone

Plataforma orientada a:

* consulta rápida;
* búsqueda;
* lectura;
* captura de notas;
* revisión de anotaciones.

## Web

Plataforma opcional.

Podrá proporcionar acceso limitado o colaboración futura, pero no reemplazará inicialmente a las aplicaciones nativas.

---

# 7. Principios del producto

## 7.1 Knowledge Object First

Toda unidad persistente administrada por KnowledgeOS es un Knowledge Object.

Los formatos de origen son únicamente fuentes de importación.

## 7.2 Contenido independiente del formato

PDF, EPUB, DOCX, CHM, HTML y Markdown no determinan el funcionamiento interno del producto.

## 7.3 Presentación independiente del contenido

Un mismo Knowledge Object puede representarse mediante diferentes vistas sin alterar su contenido.

## 7.4 Anotaciones independientes de la presentación

Las anotaciones se vinculan al contenido mediante anclajes estables.

Nunca dependen exclusivamente de una página o coordenada de pantalla.

## 7.5 Originales inmutables

Los archivos originales:

* no se modifican;
* no se sobrescriben;
* no se reemplazan;
* permanecen en su ubicación original.

## 7.6 Offline First

Las funciones esenciales deben operar sin conexión.

La conectividad amplía capacidades, pero no constituye un requisito para utilizar la biblioteca.

## 7.7 Privacidad por diseño

El usuario conserva el control sobre su biblioteca, documentos, anotaciones y modelos derivados.

## 7.8 Inteligencia artificial opcional

KnowledgeOS debe funcionar completamente sin inteligencia artificial.

## 7.9 Trazabilidad

Todo Knowledge Object debe conservar información sobre su origen, procesamiento, versiones y transformaciones.

## 7.10 Extensibilidad controlada

Las capacidades nuevas deben incorporarse mediante contratos públicos y extensiones, sin comprometer la estabilidad del núcleo.

---

# 8. Modelo del Knowledge Object

Un Knowledge Object contiene:

```text
Knowledge Object
│
├── Identity
├── UDM
├── Layout
├── Style
├── Annotations
├── Knowledge
├── Metadata
├── Provenance
├── History
├── Asset References
└── Version Information
```

## Identity

Define la identidad permanente del objeto.

Incluye:

* Knowledge Object ID;
* Content Hash;
* Schema Version;
* versión activa;
* fechas de creación y modificación.

## UDM

Representa el contenido lógico y estructurado.

## Layout

Representa la disposición física del material original:

* páginas;
* columnas;
* regiones;
* geometría;
* orden de lectura.

## Style

Representa la apariencia original o derivada:

* tipografía;
* colores;
* márgenes;
* espaciado;
* fondos;
* bordes.

## Annotations

Representa información agregada por el usuario.

## Knowledge

Representa información derivada:

* conceptos;
* entidades;
* temas;
* relaciones;
* resúmenes;
* embeddings;
* clasificaciones.

## Metadata

Contiene información descriptiva del objeto.

## Provenance

Conserva la procedencia y el historial de procesamiento.

## Asset References

Relaciona el objeto con recursos binarios almacenados externamente.

---

# 9. Formato `.kdoc`

Cada Knowledge Object persistente se almacena como un archivo `.kdoc`.

## Propiedades

* portable;
* transaccional;
* versionable;
* verificable;
* independiente de la plataforma;
* independiente del lenguaje de implementación;
* apto para funcionamiento offline.

## Tecnología interna

El formato `.kdoc` utiliza SQLite.

## Contenido interno

Puede incluir tablas para:

* identidad;
* UDM;
* nodos;
* atributos;
* layout;
* estilos;
* anotaciones;
* conocimiento derivado;
* relaciones;
* metadatos;
* procedencia;
* historial;
* versiones;
* journal interno.

## Recursos binarios

Los recursos binarios no se almacenan dentro del `.kdoc`.

Se almacenan en un repositorio común de Assets y se referencian mediante identidad y checksum.

---

# 10. Universal Document Model

El UDM es el modelo canónico del contenido de un Knowledge Object.

Representa elementos como:

* capítulos;
* secciones;
* encabezados;
* párrafos;
* listas;
* tablas;
* imágenes;
* figuras;
* fórmulas;
* bloques de código;
* citas;
* referencias;
* notas al pie.

Cada nodo posee identidad estable.

El UDM no contiene:

* lógica de interfaz;
* estado de ventanas;
* preferencias visuales globales;
* detalles de una tecnología concreta;
* recursos binarios embebidos.

Markdown es una representación derivada o de intercambio.

No es el formato interno principal.

---

# 11. Knowledge Graph

El Knowledge Graph representa conexiones entre elementos de la biblioteca.

Puede relacionar:

* Knowledge Objects;
* nodos del UDM;
* anotaciones;
* conceptos;
* entidades;
* autores;
* publicaciones;
* referencias;
* temas.

## Reglas

* no reemplaza al UDM;
* no constituye la fuente de verdad del contenido;
* puede regenerarse;
* puede enriquecerse mediante IA;
* puede combinar relaciones detectadas y relaciones creadas por el usuario.

---

# 12. Biblioteca

La Library es la base documental y operativa de KnowledgeOS.

No es un simple directorio de archivos.

Administra:

* Knowledge Objects;
* Assets;
* colecciones;
* workspaces;
* etiquetas;
* índices;
* metadatos;
* estados de sincronización;
* trabajos pendientes.

## Estructura conceptual

```text
Library
│
├── Knowledge Objects
├── Assets
├── Collections
├── Workspaces
├── Indexes
├── Jobs
└── Configuration
```

---

# 13. Source of Truth

Cada biblioteca posee una única Source of Truth.

La Source of Truth inicial será el NAS del usuario.

## NAS

Almacena la versión canónica de:

* archivos `.kdoc`;
* Assets;
* metadatos persistentes;
* información necesaria para reconstruir la biblioteca.

## Almacenamiento local

Cada dispositivo mantiene una copia de trabajo local para permitir:

* acceso offline;
* lectura;
* anotación;
* búsqueda;
* procesamiento;
* sincronización posterior.

La copia local no reemplaza a la Source of Truth.

---

# 14. Workspace y organización

Un Workspace organiza Knowledge Objects sin duplicarlos ni cambiar su identidad.

Puede contener:

* colecciones;
* carpetas virtuales;
* etiquetas;
* filtros;
* búsquedas guardadas;
* vistas personalizadas.

Un Knowledge Object puede aparecer en múltiples Workspaces o Collections.

La organización lógica no modifica su contenido.

---

# 15. Assets

Los Assets son recursos binarios asociados a uno o más Knowledge Objects.

Ejemplos:

* imágenes;
* audio;
* vídeo;
* adjuntos;
* SVG;
* datasets;
* archivos generados;
* miniaturas.

## Reglas

* poseen identidad propia;
* se verifican mediante checksum;
* pueden compartirse entre varios Knowledge Objects;
* pueden deduplicarse;
* no forman parte física del UDM;
* no se duplican dentro de cada `.kdoc`.

---

# 16. Importación

KnowledgeOS debe aceptar inicialmente:

* PDF;
* PDF escaneado;
* EPUB;
* DOCX;
* CHM;
* HTML;
* Markdown;
* TXT;
* imágenes.

## Flujo conceptual

```text
Physical Source
      ↓
Preprocessing
      ↓
Extraction or OCR
      ↓
Layout Analysis
      ↓
Structure Analysis
      ↓
UDM Construction
      ↓
Validation
      ↓
.kdoc Creation
      ↓
Library Registration
      ↓
Indexing
      ↓
Knowledge Graph Enrichment
```

## Reglas

* el original no se modifica;
* la importación debe conservar procedencia;
* OCR se ejecuta únicamente cuando corresponde;
* el resultado debe validarse;
* los errores deben ser trazables;
* el procesamiento puede repetirse mediante nuevas versiones.

---

# 17. Documentos escaneados

La recuperación de conocimiento desde documentos escaneados es una capacidad prioritaria.

El proceso debe considerar:

* corrección de orientación;
* separación de páginas;
* reducción de ruido;
* mejora de contraste;
* OCR;
* detección de columnas;
* reconocimiento de tablas;
* asociación entre figuras y captions;
* detección de encabezados y notas al pie;
* cálculo de confianza;
* revisión manual de resultados inciertos.

KnowledgeOS no promete perfección automática.

Debe identificar y mostrar las partes de baja confianza para que puedan revisarse.

---

# 18. Renderizado

Los renderizadores presentan el mismo contenido de diferentes formas.

## Vistas previstas

* Editor;
* Libro;
* Revista;
* Paper;
* Web;
* Original;
* comparación original/reconstrucción.

## Reglas

* todos consumen el UDM;
* cambiar de vista no modifica el contenido;
* las anotaciones permanecen vinculadas;
* un renderizador puede utilizar o ignorar Layout y Style;
* la vista original utiliza la fuente física cuando está disponible.

---

# 19. Anotaciones

Las anotaciones forman una capa independiente.

## Tipos iniciales

* Highlight;
* Underline;
* Ink;
* Sticky Note;
* Text Note;
* Bookmark;
* Comment;
* Shape;
* Arrow.

## Anclaje

Las anotaciones se vinculan a:

* Knowledge Object;
* nodo UDM;
* rango de contenido;
* versión de referencia.

Las coordenadas físicas pueden conservarse como apoyo, pero no constituyen el único anclaje.

## Notas

Las notas pueden ser:

* manuscritas;
* ingresadas mediante teclado;
* visualizadas con tipografía manuscrita;
* vinculadas a contenido específico.

---

# 20. Sistema de resaltado

El sistema de resaltado utilizará un modelo semántico basado en:

* familia de color;
* intensidad;
* opacidad;
* estilo;
* modo de composición.

## Familias

* amarillo;
* verde;
* azul;
* rosa;
* naranja;
* violeta;
* turquesa;
* gris.

## Intensidades

* pastel;
* clásica;
* fluorescente.

## Modelo de color

OKLCH será la base del sistema cromático.

El color almacenado representa una intención visual y no un valor RGB fijo.

Esto permite adaptar los resaltados a:

* modo claro;
* modo oscuro;
* modo sepia;
* alto contraste.

---

# 21. Búsqueda

La búsqueda debe operar sobre toda la biblioteca.

## Capacidades

* búsqueda textual;
* búsqueda por metadatos;
* búsqueda estructural;
* búsqueda en anotaciones;
* búsqueda semántica;
* búsqueda por relaciones;
* filtros;
* ranking;
* sugerencias.

Los índices son derivados y reconstruibles.

---

# 22. Inteligencia artificial

La IA es una capacidad opcional.

Opera sobre:

* UDM;
* anotaciones;
* Knowledge Graph;
* metadatos;
* resultados de búsqueda.

## Capacidades previstas

* preguntas y respuestas;
* resúmenes;
* explicación contextual;
* traducción;
* clasificación;
* extracción de entidades;
* generación de embeddings;
* relaciones entre Knowledge Objects;
* mapas conceptuales;
* análisis de anotaciones.

## Reglas

* nunca modifica automáticamente el contenido canónico;
* todo resultado debe ser trazable;
* los proveedores deben ser intercambiables;
* deben admitirse modelos locales y remotos;
* la ausencia de IA no impide usar las capacidades esenciales.

---

# 23. Sincronización

La sincronización será:

* incremental;
* reanudable;
* compatible con trabajo offline;
* basada en identidades estables;
* capaz de detectar conflictos;
* trazable.

## Datos persistentes

Se sincronizan:

* `.kdoc`;
* Assets;
* metadatos persistentes;
* anotaciones;
* estados necesarios de biblioteca.

## Datos regenerables

No necesitan sincronizarse:

* caché;
* índices reconstruibles;
* previews temporales;
* archivos temporales.

Los conflictos nunca deben provocar pérdida silenciosa de información.

---

# 24. Extensibilidad

KnowledgeOS debe admitir extensiones mediante contratos públicos.

## Tipos previstos

* importadores;
* exportadores;
* renderizadores;
* motores OCR;
* proveedores de IA;
* herramientas;
* procesadores de conocimiento.

Los plugins:

* no acceden directamente al almacenamiento;
* no acceden directamente a implementaciones internas;
* declaran compatibilidad;
* declaran permisos;
* son administrados por el Plugin Engine.

---

# 25. Privacidad y propiedad

El usuario es propietario de:

* sus Knowledge Objects;
* archivos `.kdoc`;
* Assets;
* anotaciones;
* índices;
* conocimiento derivado;
* configuraciones.

KnowledgeOS no debe requerir una cuenta remota para sus funciones esenciales.

La transmisión de contenido a proveedores externos siempre debe ser explícita y configurable.

---

# 26. No objetivos

KnowledgeOS no pretende ser:

* un visor PDF convencional;
* un editor Markdown tradicional;
* un procesador de texto;
* un IDE;
* una copia de Obsidian;
* una copia de Notion;
* una copia de GoodNotes;
* una plataforma exclusivamente basada en IA;
* un sistema Cloud First;
* una herramienta que modifique los originales del usuario.

KnowledgeOS tampoco pretende garantizar una conversión perfecta de todos los documentos sin revisión.

---

# 27. Roadmap de alto nivel

## Fase 1 — Core Platform

* Library;
* Knowledge Object;
* `.kdoc`;
* UDM;
* Assets;
* importación básica;
* almacenamiento local;
* macOS.

## Fase 2 — Reading and Annotation

* vistas Editor y Libro;
* highlights;
* Sticky Notes;
* iPad;
* Apple Pencil;
* anotaciones sincronizables.

## Fase 3 — Advanced Import and Rendering

* OCR avanzado;
* análisis de layout;
* vista Paper;
* vista Revista;
* CHM;
* EPUB;
* comparación con original.

## Fase 4 — Knowledge Intelligence

* búsqueda semántica;
* Knowledge Graph;
* embeddings;
* RAG;
* IA local y remota;
* relaciones entre objetos.

## Fase 5 — Platform Ecosystem

* Plugin SDK;
* nuevos importadores;
* nuevos renderizadores;
* web opcional;
* colaboración, si aporta valor.

---

# 28. Glosario

## KnowledgeOS

Plataforma personal de gestión del conocimiento.

## Knowledge Object

Unidad persistente fundamental administrada por KnowledgeOS.

## `.kdoc`

Formato nativo de un Knowledge Object, implementado internamente sobre SQLite.

## Physical Source

Archivo o fuente externa utilizada para crear o actualizar un Knowledge Object.

## Document

Tipo concreto de Knowledge Object cuyo contenido representa un documento.

## UDM

Universal Document Model. Representación canónica del contenido lógico y estructurado.

## UDM Node

Unidad identificable dentro del UDM.

## Knowledge Graph

Modelo derivado que relaciona objetos, nodos, conceptos, entidades y referencias.

## Library

Base documental que administra los Knowledge Objects y recursos del usuario.

## Workspace

Organización lógica de elementos de una Library.

## Collection

Agrupación lógica de Knowledge Objects.

## Asset

Recurso binario externo referenciado por uno o más Knowledge Objects.

## Layout Model

Representación de la disposición física del material original.

## Style Model

Representación de propiedades visuales.

## Annotation

Información agregada por el usuario sin modificar el contenido canónico.

## Anchor

Referencia estable desde una anotación o relación hacia contenido del UDM.

## Source of Truth

Ubicación canónica de una biblioteca.

## Import Pipeline

Proceso que transforma una fuente física en un Knowledge Object.

## Renderer

Componente que produce una representación visual del UDM.

## Engine

Módulo funcional del Knowledge Core con responsabilidades delimitadas.

---

# 29. Decisiones congeladas

1. Knowledge Object es la unidad persistente fundamental.
2. Document es un tipo de Knowledge Object.
3. `.kdoc` es el formato nativo de KnowledgeOS.
4. `.kdoc` utiliza SQLite internamente.
5. El UDM representa el contenido estructurado, no el objeto persistente completo.
6. El Knowledge Graph es derivado y reconstruible.
7. Los Assets se almacenan externamente y se referencian mediante identidad.
8. Los archivos originales nunca se modifican.
9. Markdown es una representación derivada o de intercambio.
10. Las anotaciones pertenecen al contenido y no a una vista concreta.
11. Layout, Style, Annotations y Knowledge permanecen separados del contenido.
12. KnowledgeOS es Offline First.
13. El NAS es la Source of Truth inicial.
14. La IA es opcional y no modifica automáticamente el contenido canónico.
15. Los proveedores externos son intercambiables.
16. Las funciones esenciales no requieren cuenta ni conexión.
17. macOS es la plataforma principal inicial.
18. iPad es una plataforma prioritaria para lectura y Apple Pencil.
19. iPhone se orienta a consulta y captura rápida.
20. Web es opcional.
21. OKLCH será la base del sistema de resaltado.
22. La extensibilidad se realiza mediante contratos públicos.
23. Toda operación persistente debe ser versionable y trazable.
24. Los datos regenerables no constituyen fuente de verdad.
25. Cualquier cambio futuro de estas decisiones requerirá un ADR.
