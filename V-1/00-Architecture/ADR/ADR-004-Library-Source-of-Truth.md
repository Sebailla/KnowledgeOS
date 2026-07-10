
# ADR-004 — Library Source of Truth

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-004 v1.0

**Related Documents**

* ../ProductVision.md
* ../ArchitectureModel.md
* ../DomainModel.md
* ../KnowledgeLifecycle.md
* ../ArchitectureVocabulary.md
* ../QualityAttributes.md

---

# 1. Context

KnowledgeOS administra una biblioteca personal que puede crecer durante décadas y contener cientos de miles de Knowledge Objects, millones de Assets y una gran cantidad de información derivada.

El usuario puede trabajar desde múltiples dispositivos:

* macOS;
* iPadOS;
* iOS;
* futuras plataformas.

Era necesario definir una única fuente de verdad (Source of Truth) para evitar inconsistencias, pérdidas de datos y conflictos derivados de múltiples copias canónicas.

La arquitectura debía garantizar:

* funcionamiento Offline First;
* sincronización incremental;
* independencia de proveedores Cloud;
* portabilidad;
* resiliencia;
* control absoluto del usuario sobre su información.

---

# 2. Decisión

Cada **Library** posee exactamente una **Source of Truth**.

La Source of Truth inicial será el **NAS del usuario**.

Todos los dispositivos mantienen una **Working Copy** local sincronizada con la Source of Truth.

```text
          Source of Truth
              (NAS)
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 macOS      iPadOS      iPhone
 Working     Working     Working
  Copy         Copy        Copy
```

La Source of Truth nunca es reemplazada por una copia local.

---

# 3. Motivación

Separar claramente:

* almacenamiento permanente;
* almacenamiento de trabajo;
* sincronización.

Esta separación permite:

* trabajar completamente offline;
* reducir dependencias externas;
* facilitar recuperación;
* preservar integridad;
* simplificar el modelo mental del usuario.

---

# 4. Detailed Design

## Library

La Library representa la totalidad del conocimiento administrado por el usuario.

No es un directorio.

No es una base de datos.

Es una entidad del dominio.

La Library administra:

* Knowledge Objects;
* Assets;
* Collections;
* Workspaces;
* índices;
* Journal;
* configuración;
* sincronización.

---

## Source of Truth

La Source of Truth contiene la versión oficial de la Library.

Debe contener:

* Object Repository;
* Asset Repository;
* Journal Repository;
* Configuration Repository;
* Backup Repository.

El Index Repository y la Cache pueden reconstruirse y no forman parte de la información canónica.

---

## Working Copy

Cada dispositivo mantiene una Working Copy local.

La Working Copy permite:

* importar;
* leer;
* anotar;
* buscar;
* renderizar;
* exportar;
* ejecutar IA local;
* trabajar sin conexión.

Toda modificación se realiza inicialmente sobre la Working Copy.

---

## Sincronización

La sincronización ocurre entre:

```text
Working Copy
      │
      ▼
Synchronization Engine
      │
      ▼
Source of Truth
```

Nunca entre dos Working Copies.

---

## Repositorios

Cada Library se organiza mediante repositorios lógicos.

```text
Library

├── Object Repository
├── Asset Repository
├── Journal Repository
├── Index Repository
├── Backup Repository
└── Configuration Repository
```

Cada repositorio posee una responsabilidad única.

---

## Object Repository

Contiene todos los archivos `.kdoc`.

Cada Knowledge Object posee identidad propia.

---

## Asset Repository

Contiene todos los recursos binarios.

Los Assets:

* son compartidos;
* utilizan direccionamiento por contenido;
* se deduplican mediante SHA-256.

---

## Journal Repository

Registra todas las operaciones persistentes.

Permite:

* recuperación;
* auditoría;
* reanudación;
* diagnóstico.

---

## Index Repository

Almacena únicamente índices reconstruibles.

Ejemplos:

* Full Text;
* Metadata;
* Semantic;
* Graph.

Puede eliminarse completamente.

---

## Backup Repository

Administra snapshots completos de la Library.

Su contenido permite reconstruir la biblioteca en caso de desastre.

---

## Configuration Repository

Almacena preferencias y configuración de la plataforma.

No contiene conocimiento del usuario.

---

# 5. Funcionamiento

## Importación

```text
Physical Source

↓

Import

↓

Working Copy

↓

Synchronization

↓

Source of Truth
```

---

## Edición

Toda modificación ocurre primero en la Working Copy.

Posteriormente se sincroniza.

---

## Lectura

Toda lectura ocurre sobre la Working Copy.

Nunca sobre la Source of Truth.

---

## Recuperación

En caso de pérdida de la Working Copy:

* se restaura desde la Source of Truth;
* se reconstruyen índices;
* se reconstruye el Knowledge Graph;
* se recuperan Workflows pendientes cuando corresponda.

---

# 6. Reglas

1. Existe exactamente una Source of Truth por Library.
2. Toda Working Copy deriva de la Source of Truth.
3. La Working Copy nunca reemplaza la Source of Truth.
4. Toda modificación pasa por sincronización.
5. Los índices son reconstruibles.
6. La Cache es descartable.
7. Los Assets permanecen fuera de los `.kdoc`.
8. El Journal registra toda operación persistente.

---

# 7. Alternativas consideradas

## Cloud Storage como Source of Truth

Descartado.

Introduce dependencia de un proveedor externo y contradice el principio Offline First.

---

## Múltiples copias canónicas

Descartado.

Complica la sincronización y aumenta el riesgo de inconsistencias.

---

## Base de datos centralizada

Descartado.

Reduce la portabilidad y dificulta la recuperación independiente de Knowledge Objects.

---

# 8. Consecuencias

## Positivas

* Modelo conceptual sencillo.
* Recuperación simplificada.
* Alta resiliencia.
* Sincronización incremental.
* Mayor control por parte del usuario.
* Independencia tecnológica.

## Negativas

* Requiere mecanismos de sincronización robustos.
* Necesita detección y resolución de conflictos.
* Incrementa la complejidad del Sync Engine.

---

# 9. Trade-offs

Se prioriza:

* control del usuario sobre automatización;
* resiliencia sobre simplicidad;
* independencia tecnológica sobre integración con servicios Cloud;
* consistencia sobre rendimiento de sincronización.

---

# 10. Riesgos

## NAS inaccesible

Mitigación:

* Working Copy completamente funcional.
* Reintentos automáticos.
* Sincronización diferida.

---

## Corrupción de la Source of Truth

Mitigación:

* Backups.
* Journal Repository.
* Checksums.
* Versionado.

---

## Conflictos entre dispositivos

Mitigación:

* Workflow Engine.
* Conflict Resolver.
* Versionado.
* Journal.

---

# 11. Related Documents

* ProductVision.md
* DomainModel.md
* KnowledgeLifecycle.md
* ArchitectureVocabulary.md
* QualityAttributes.md
* Storage Architecture

---

# 12. Related ADR

* ADR-001 — Architectural Style
* ADR-003 — Offline First
* ADR-005 — Engine Based Architecture
* ADR-008 — Storage Architecture
* ADR-009 — Synchronization Strategy
* ADR-014 — Workflow Engine
* ADR-015 — Global Identity Model

---

# 13. Status

**Accepted**

La existencia de una única **Source of Truth** por **Library** constituye una decisión arquitectónica fundamental de KnowledgeOS.

Toda estrategia de almacenamiento, sincronización y recuperación deberá preservar este modelo.

Las modificaciones futuras requerirán un nuevo Architecture Decision Record.
