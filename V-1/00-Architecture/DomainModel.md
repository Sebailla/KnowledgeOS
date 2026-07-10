
# Domain Model

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define el modelo conceptual del dominio de KnowledgeOS.

No describe clases, tablas de base de datos ni implementaciones.

Describe los conceptos fundamentales sobre los cuales se construye todo el sistema.

---

# 2. Principios

El modelo del dominio se basa en los siguientes principios:

* Todo el conocimiento se representa mediante Knowledge Objects.
* Todo Knowledge Object posee identidad permanente.
* Todo Knowledge Object contiene exactamente un UDM.
* El conocimiento derivado nunca modifica el contenido original.
* Los Assets son entidades independientes.
* La organización nunca modifica el contenido.
* Todo puede relacionarse.

---

# 3. Modelo Conceptual

```text
Library

├── Knowledge Objects
├── Collections
├── Workspaces
├── Assets
├── Jobs
├── Plugins
└── Knowledge Graph
```

La **Library** constituye la raíz del dominio.

---

# 4. Library

Representa la biblioteca completa del usuario.

Responsabilidades:

* administrar Knowledge Objects;
* administrar Assets;
* administrar Collections;
* administrar Workspaces;
* administrar índices;
* administrar sincronización;
* administrar configuración.

Una Library posee una única Source of Truth.

---

# 5. Knowledge Object

Es la unidad persistente fundamental.

Puede representar:

* libro;
* paper;
* nota;
* conversación IA;
* página web;
* correo;
* manual;
* notebook;
* documento técnico;
* cualquier unidad futura de conocimiento.

Todo Knowledge Object se almacena como un archivo `.kdoc`.

---

# 6. Estructura de un Knowledge Object

```text
Knowledge Object

├── Identity
├── Metadata
├── UDM
├── Layout
├── Style
├── Annotations
├── Knowledge
├── Provenance
├── History
└── Asset References
```

Cada componente tiene una responsabilidad única.

---

# 7. Identity

Define la identidad permanente.

Incluye:

* KnowledgeObjectID
* ContentHash
* SchemaVersion
* Version
* CreatedAt
* UpdatedAt

Nunca cambia durante la vida del objeto.

---

# 8. Metadata

Describe el objeto.

Ejemplos:

* título;
* autor;
* idioma;
* editorial;
* palabras clave;
* categoría;
* licencia;
* ISBN;
* DOI.

No forma parte del contenido.

---

# 9. UDM

Representa el contenido lógico.

Contiene:

* capítulos;
* secciones;
* párrafos;
* listas;
* tablas;
* figuras;
* fórmulas;
* referencias;
* bloques de código.

El UDM es la fuente de verdad del contenido.

---

# 10. Layout

Describe la estructura física.

Incluye:

* páginas;
* columnas;
* regiones;
* encabezados;
* pies;
* bounding boxes;
* reading order.

Puede ignorarse durante el render.

---

# 11. Style

Representa la apariencia.

Incluye:

* tipografía;
* colores;
* espaciado;
* márgenes;
* fondos;
* alineación.

No modifica el contenido.

---

# 12. Annotations

Representan información creada por el usuario.

Tipos iniciales:

* Highlight
* Underline
* Sticky Note
* Text Note
* Bookmark
* Ink
* Comment
* Shape
* Arrow

Toda anotación utiliza Anchors.

---

# 13. Knowledge

Representa conocimiento derivado.

Incluye:

* entidades;
* conceptos;
* temas;
* relaciones;
* embeddings;
* resúmenes;
* clasificaciones;
* backlinks;
* etiquetas.

Puede regenerarse.

---

# 14. Provenance

Describe el origen.

Incluye:

* archivo original;
* formato;
* OCR;
* importador;
* historial de procesamiento;
* migraciones.

Garantiza trazabilidad completa.

---

# 15. History

Registra la evolución.

Incluye:

* versiones;
* cambios;
* operaciones;
* eventos.

Nunca elimina información histórica.

---

# 16. Assets

Representan recursos binarios independientes.

Ejemplos:

* imágenes;
* audio;
* vídeo;
* SVG;
* datasets;
* adjuntos.

Un Asset puede pertenecer a múltiples Knowledge Objects.

La identidad del Asset se basa en checksum.

---

# 17. Collections

Agrupan Knowledge Objects.

Características:

* no duplican contenido;
* no alteran identidad;
* pueden anidarse;
* pueden contener reglas.

Un Knowledge Object puede pertenecer a múltiples Collections.

---

# 18. Workspaces

Representan espacios de trabajo.

Un Workspace organiza el trabajo del usuario mediante:

* Collections;
* filtros;
* búsquedas;
* paneles;
* vistas.

No modifican el contenido persistente.

---

# 19. Knowledge Graph

Representa relaciones entre elementos.

Puede relacionar:

* Knowledge Objects;
* nodos UDM;
* entidades;
* conceptos;
* Assets;
* anotaciones.

Es derivado.

No constituye la fuente de verdad.

---

# 20. Jobs

Representan procesos largos.

Ejemplos:

* OCR;
* importación;
* indexación;
* generación de embeddings;
* sincronización;
* exportación.

Todo Job posee estado.

---

# 21. Plugins

Extienden capacidades.

Pueden aportar:

* importadores;
* renderizadores;
* exportadores;
* motores OCR;
* proveedores IA;
* herramientas.

Nunca modifican directamente el dominio.

---

# 22. Relaciones

```text
Library
    │
    ├──────────────┐
    ▼              ▼
Knowledge Object   Collection
        │              │
        │              │
        └──────┬───────┘
               ▼
          Workspace

Knowledge Object
        │
        ├── UDM
        ├── Metadata
        ├── Layout
        ├── Style
        ├── Knowledge
        ├── Provenance
        ├── History
        └── Asset References

Knowledge Object
        │
        ▼
Knowledge Graph
```

---

# 23. Reglas del Dominio

1. Existe exactamente un UDM por Knowledge Object.
2. Todo Knowledge Object posee identidad permanente.
3. Todo Knowledge Object se almacena como un `.kdoc`.
4. Todo Asset posee identidad independiente.
5. El UDM constituye la fuente de verdad del contenido.
6. El Knowledge Graph es derivado.
7. Los Assets nunca se duplican.
8. Collections y Workspaces no modifican el contenido.
9. Toda anotación referencia un Anchor.
10. Toda modificación es versionable.
11. Toda modificación es trazable.
12. Todo componente del dominio es independiente de la plataforma.

---

# 24. Evolución

El dominio está diseñado para admitir nuevos tipos de Knowledge Objects sin modificar la arquitectura.

Ejemplos futuros:

* Podcasts.
* Vídeos.
* Bases de conocimiento.
* Proyectos.
* Wikis.
* Cuadernos científicos.
* Objetos definidos por plugins.

Todos compartirán el mismo modelo de dominio.

---

# 25. Estado

Este documento define el modelo conceptual oficial de KnowledgeOS.

Cualquier modificación estructural del dominio deberá aprobarse mediante un Architecture Decision Record (ADR).
