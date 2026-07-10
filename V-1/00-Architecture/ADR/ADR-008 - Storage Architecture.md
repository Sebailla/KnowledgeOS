
# ADR-008 — Storage Architecture

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-008 v1.0

**Related Documents**

* ../ArchitectureModel.md
* ../ArchitectureVocabulary.md
* ../ArchitectureConstraints.md
* ../QualityAttributes.md
* ../../01-Specifications/Storage/

---

# 1. Context

KnowledgeOS administra bibliotecas que pueden contener durante décadas:

* cientos de miles de Knowledge Objects;
* millones de Assets;
* millones de anotaciones;
* índices reconstruibles;
* información derivada.

El almacenamiento debía satisfacer simultáneamente:

* Offline First;
* integridad;
* portabilidad;
* deduplicación;
* recuperación;
* versionado;
* sincronización incremental.

Una organización basada únicamente en carpetas físicas no representa correctamente el dominio.

---

# 2. Decision Drivers

La decisión debía garantizar:

* separación entre dominio y persistencia;
* independencia tecnológica;
* recuperación ante fallos;
* crecimiento a largo plazo;
* bajo acoplamiento;
* alta mantenibilidad.

---

# 3. Decision

KnowledgeOS organiza toda la persistencia mediante **Logical Repositories**.

Cada Repository administra un único tipo de información.

La estructura física constituye únicamente una implementación del modelo lógico.

```text
Library

├── Object Repository
├── Asset Repository
├── Index Repository
├── Journal Repository
├── Backup Repository
└── Configuration Repository
```

---

# 4. Detailed Design

## Object Repository

Responsabilidad:

Administrar todos los Knowledge Objects.

Cada objeto persistente se almacena como un archivo `.kdoc`.

Gestiona:

* creación;
* lectura;
* actualización;
* versionado;
* migraciones;
* eliminación lógica.

No administra Assets.

---

## Asset Repository

Responsabilidad:

Administrar todos los recursos binarios.

Ejemplos:

* imágenes;
* audio;
* vídeo;
* SVG;
* datasets;
* archivos adjuntos.

Los Assets poseen identidad propia y pueden compartirse entre múltiples Knowledge Objects.

---

## Content Addressing

Los Assets utilizan direccionamiento por contenido.

```text
SHA256

ab/

cd/

abcdef123456...
```

La ubicación física nunca representa la identidad.

---

## Index Repository

Contiene únicamente información reconstruible.

Ejemplos:

* Full Text Index;
* Metadata Index;
* Semantic Index;
* Graph Index;
* Embeddings.

Puede eliminarse completamente.

---

## Journal Repository

Registra todas las operaciones persistentes.

Permite:

* recuperación;
* auditoría;
* sincronización;
* reanudación;
* diagnóstico.

No reemplaza el History del Knowledge Object.

---

## Backup Repository

Administra snapshots completos de la Library.

Su función es permitir recuperación ante desastres.

---

## Configuration Repository

Contiene:

* preferencias;
* configuración;
* parámetros locales;
* configuración de Plugins.

Nunca almacena contenido del usuario.

---

# 5. Persistencia

El formato persistente oficial es:

```text
Knowledge Object

↓

.kdoc

↓

SQLite
```

SQLite constituye una implementación.

No forma parte del dominio.

---

# 6. Integridad

Toda información persistente deberá garantizar:

* checksums;
* versionado;
* transacciones;
* Journal;
* validación.

---

# 7. Reglas

1. Todo Knowledge Object pertenece al Object Repository.
2. Todo Asset pertenece al Asset Repository.
3. Ningún Asset se almacena dentro del `.kdoc`.
4. Los índices son reconstruibles.
5. La Cache nunca es persistente.
6. Todo cambio genera Journal.
7. Toda operación persistente es transaccional.

---

# 8. Alternatives Considered

## Directorios tradicionales

Descartados.

Representan implementación.

No representan el dominio.

---

## Base de datos única

Descartada.

Reduce portabilidad.

---

## Assets embebidos

Descartados.

Impiden deduplicación.

---

# 9. Consequences

## Positivas

* Persistencia desacoplada.
* Mayor escalabilidad.
* Deduplicación.
* Recuperación sencilla.
* Evolución independiente.

## Negativas

* Mayor complejidad inicial.
* Coordinación entre repositorios.

---

# 10. Trade-offs

Se prioriza:

* claridad del dominio sobre simplicidad física;
* recuperación sobre optimización prematura;
* independencia tecnológica sobre integración específica.

---

# 11. Risks

## Corrupción

Mitigación:

Checksums + Journal + Backups.

---

## Crecimiento

Mitigación:

Repositories independientes.

---

## Migraciones

Mitigación:

Versionado del `.kdoc`.

---

# 12. Compliance

Esta decisión deberá cumplirse obligatoriamente por:

* Library Engine;
* Import Engine;
* Sync Engine;
* Export Engine;
* Backup Engine (futuro);
* Workflow Engine.

---

# 13. Related Documents

* Storage/
* LibraryStructure.md
* Assets.md
* Cache.md
* PackageFormat.md
* Indexes.md

---

# 14. Related ADR

* ADR-003 — Offline First
* ADR-004 — Library Source of Truth
* ADR-005 — Engine Based Architecture
* ADR-009 — Synchronization Strategy
* ADR-014 — Workflow Engine
* ADR-015 — Global Identity Model

---

# 15. Status

**Accepted**

Los Logical Repositories constituyen la arquitectura oficial de almacenamiento de KnowledgeOS.

Toda evolución futura deberá preservar este modelo o aprobar un nuevo ADR.
