
# Architecture Model

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define la arquitectura lógica de KnowledgeOS.

Su propósito es establecer la organización del sistema, la separación de responsabilidades y las reglas arquitectónicas que deberán respetarse durante toda la vida del proyecto.

Las decisiones específicas se documentan mediante ADR.

---

# 2. Filosofía Arquitectónica

KnowledgeOS se construye siguiendo cinco principios fundamentales.

* Modularidad.
* Bajo acoplamiento.
* Alta cohesión.
* Offline First.
* Evolución incremental.

El sistema debe poder crecer durante muchos años sin requerir reescrituras masivas.

---

# 3. Arquitectura General

KnowledgeOS adopta una arquitectura basada en un **Modular Monolith**.

```text
KnowledgeOS

├── Kernel
├── Engines
├── Contracts
├── Infrastructure
└── UI
```

Cada módulo posee una única responsabilidad claramente definida.

La comunicación entre módulos ocurre únicamente mediante contratos públicos.

---

# 4. Capas Arquitectónicas

```text
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

## Presentation

Contiene exclusivamente la interfaz de usuario.

Ejemplos:

* macOS
* iPadOS
* iPhone
* Web

No contiene reglas de negocio.

---

## Application

Orquesta los casos de uso.

Gestiona:

* Commands
* Queries
* Events
* Jobs
* Workflows

No contiene detalles de persistencia.

---

## Domain

Representa el conocimiento del negocio.

Aquí viven:

* Knowledge Object
* UDM
* Knowledge Graph
* reglas del dominio
* modelos
* contratos

Es completamente independiente de tecnologías.

---

## Infrastructure

Implementa servicios concretos.

Ejemplos:

* SQLite
* NAS
* OCR
* IA
* almacenamiento
* red
* sincronización

Puede reemplazarse sin modificar el dominio.

---

# 5. Núcleo del Sistema

El núcleo está formado por cuatro conceptos.

```text
Knowledge Object

↓

UDM

↓

Knowledge Graph

↓

Assets
```

## Knowledge Object

Unidad persistente administrada por la Library.

Representa cualquier elemento de conocimiento.

---

## UDM

Representa el contenido estructurado.

Es la fuente de verdad del contenido.

---

## Knowledge Graph

Representa relaciones entre objetos.

Es derivado.

Puede reconstruirse.

---

## Assets

Representan recursos binarios compartidos.

No forman parte física del `.kdoc`.

---

# 6. Arquitectura por Engines

La funcionalidad se divide en Engines independientes.

```text
Kernel

├── Library Engine
├── Import Engine
├── Search Engine
├── Render Engine
├── Annotation Engine
├── AI Engine
├── Sync Engine
├── Export Engine
└── Plugin Engine
```

Cada Engine posee:

* API pública.
* Modelo interno.
* Eventos.
* Commands.
* Queries.

Ningún Engine accede directamente a la implementación interna de otro.

---

# 7. Kernel

El Kernel proporciona servicios comunes.

Responsabilidades:

* Command Bus.
* Query Bus.
* Event Bus.
* Scheduler.
* Jobs.
* Configuración.
* Dependency Injection.
* Logging.
* Observabilidad.

El Kernel no implementa reglas del dominio.

---

# 8. Library Engine

Responsabilidad:

Administrar Knowledge Objects.

Gestiona:

* creación;
* apertura;
* actualización;
* eliminación;
* organización;
* colecciones;
* workspaces.

Nunca interpreta formatos externos.

---

# 9. Import Engine

Responsabilidad:

Transformar fuentes externas en Knowledge Objects.

Proceso:

```text
Physical Source

↓

Import

↓

UDM

↓

.kdoc

↓

Library
```

---

# 10. Render Engine

Responsabilidad:

Construir representaciones visuales.

Nunca modifica el contenido.

Renderizadores previstos:

* Editor
* Book
* Paper
* Magazine
* Web
* Original

Todos consumen el mismo UDM.

---

# 11. Search Engine

Responsabilidad:

Localizar conocimiento.

Utiliza:

* índices textuales;
* índices semánticos;
* Knowledge Graph;
* metadatos.

Los índices son reconstruibles.

---

# 12. Annotation Engine

Responsabilidad:

Administrar información creada por el usuario.

Las anotaciones:

* son independientes;
* poseen identidad;
* son versionables;
* utilizan Anchors.

---

# 13. AI Engine

Responsabilidad:

Enriquecer Knowledge Objects.

Puede:

* resumir;
* traducir;
* clasificar;
* generar embeddings;
* extraer entidades;
* responder preguntas.

Nunca modifica automáticamente el contenido del UDM.

---

# 14. Sync Engine

Responsabilidad:

Sincronizar bibliotecas.

Características:

* incremental;
* offline;
* tolerante a fallos;
* reanudable.

La Source of Truth inicial es el NAS.

---

# 15. Export Engine

Responsabilidad:

Generar formatos derivados.

Ejemplos:

* Markdown
* HTML
* PDF
* EPUB

El contenido exportado siempre proviene del UDM.

---

# 16. Plugin Engine

Responsabilidad:

Extender capacidades.

Tipos previstos:

* importadores;
* exportadores;
* renderizadores;
* OCR;
* IA;
* herramientas.

Toda interacción ocurre mediante contratos públicos.

---

# 17. Comunicación

Los Engines nunca invocan implementaciones internas.

Toda comunicación utiliza:

* Commands.
* Queries.
* Events.
* DTOs.

No existen dependencias circulares.

---

# 18. Persistencia

```text
Knowledge Object

↓

.kdoc

↓

SQLite
```

Los Assets se almacenan externamente.

La Database contiene únicamente información operacional.

---

# 19. Source of Truth

Existe una única Source of Truth por biblioteca.

Inicialmente:

NAS.

Cada dispositivo mantiene una copia local para trabajar offline.

---

# 20. Inteligencia Artificial

La IA constituye una capacidad adicional.

Puede utilizar:

* modelos locales;
* modelos remotos;
* múltiples proveedores.

Toda integración ocurre mediante un Provider Manager desacoplado.

---

# 21. Escalabilidad

La arquitectura debe permitir:

* nuevos importadores;
* nuevos renderizadores;
* nuevos modelos de IA;
* nuevos plugins;
* nuevas plataformas.

Sin modificar el dominio.

---

# 22. Restricciones

No existen dependencias directas entre Engines.

No existen referencias a tecnologías dentro del dominio.

Los formatos originales nunca forman parte del modelo interno.

Los Assets no se duplican.

Los índices son reconstruibles.

La caché es descartable.

Todo cambio persistente debe ser trazable.

---

# 23. Decisiones arquitectónicas fundamentales

1. Modular Monolith.
2. Engine-Based Architecture.
3. Knowledge Object como unidad persistente.
4. `.kdoc` como formato nativo.
5. SQLite como implementación del formato `.kdoc`.
6. UDM como representación canónica del contenido.
7. Knowledge Graph como modelo derivado.
8. Assets externos con deduplicación por checksum.
9. Offline First.
10. NAS como Source of Truth.
11. Comunicación mediante Commands, Queries y Events.
12. Plugins mediante contratos públicos.
13. IA desacoplada mediante proveedores intercambiables.
14. Toda evolución estructural se realizará mediante ADR.

---

# 24. Estado

La arquitectura definida en este documento constituye la base oficial de KnowledgeOS.

Las modificaciones posteriores deberán aprobarse mediante un nuevo Architecture Decision Record (ADR).
