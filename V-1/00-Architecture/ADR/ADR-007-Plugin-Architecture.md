# ADR-007 — Plugin Architecture

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-007 v1.0

**Related Documents**

* ../ArchitectureModel.md
* ../ArchitectureVocabulary.md
* ../ArchitectureConstraints.md
* ../ArchitecturePrinciples.md
* ../../01-Specifications/PluginSDK/

---

# 1. Context

KnowledgeOS debe evolucionar durante muchos años.

No es posible prever todas las funcionalidades futuras.

Nuevos formatos, motores de IA, exportadores, renderizadores e integraciones deberán incorporarse sin modificar el núcleo de la plataforma.

Era necesario definir un mecanismo oficial de extensibilidad.

---

# 2. Decisión

KnowledgeOS adopta una arquitectura basada en **Plugins**.

Los Plugins constituyen extensiones independientes que interactúan exclusivamente mediante contratos públicos.

Los Plugins nunca forman parte del dominio.

Nunca modifican la arquitectura del núcleo.

```text
KnowledgeOS
│
├── Kernel
├── Engines
│
└── Plugin Engine
        │
        ├── Plugin A
        ├── Plugin B
        └── Plugin C
```

---

# 3. Motivación

La arquitectura de Plugins permite:

* ampliar funcionalidades;
* mantener el núcleo estable;
* desacoplar integraciones;
* facilitar desarrollos de terceros;
* reducir modificaciones del Core.

---

# 4. Detailed Design

## Plugin Engine

El Plugin Engine administra el ciclo de vida completo de los Plugins.

Responsabilidades:

* descubrimiento;
* instalación;
* validación;
* activación;
* desactivación;
* actualización;
* desinstalación;
* aislamiento;
* compatibilidad.

---

## Plugin

Todo Plugin es un paquete autocontenido.

Debe incluir:

* Manifest;
* Metadata;
* Version;
* Permissions;
* Public Contracts utilizados;
* Entry Point.

---

## Manifest

Todo Plugin declara:

* PluginID;
* Name;
* Version;
* Publisher;
* Description;
* Minimum KnowledgeOS Version;
* Maximum KnowledgeOS Version;
* Required Permissions;
* Required Engines.

---

## Identidad

Todo Plugin posee:

* PluginID;
* PublisherID;
* VersionID.

La identidad nunca depende del nombre visible.

---

## Permisos

Los permisos son explícitos.

Ejemplos:

* Read Knowledge Objects
* Write Annotations
* Export Content
* Execute AI Requests
* Access Network
* Read Assets

Si un permiso no está declarado, el acceso está prohibido.

---

## Contratos

Todo Plugin interactúa únicamente mediante:

* Commands;
* Queries;
* Events;
* Public APIs.

Nunca accede a:

* clases internas;
* repositorios privados;
* bases de datos;
* implementaciones de Engines.

---

## Eventos

Los Plugins pueden:

* publicar eventos;
* consumir eventos;
* reaccionar a eventos.

No pueden modificar eventos ya publicados.

---

## Ciclo de Vida

```text
Discovered
      │
      ▼
Installed
      │
      ▼
Validated
      │
      ▼
Activated
      │
      ▼
Running
      │
      ▼
Disabled
      │
      ▼
Removed
```

---

## Compatibilidad

Todo Plugin declara:

* versión mínima compatible;
* versión máxima compatible;
* APIs requeridas;
* capacidades opcionales.

KnowledgeOS podrá impedir la carga de Plugins incompatibles.

---

## Aislamiento

Los Plugins se ejecutan aislados del núcleo.

No pueden:

* modificar el dominio;
* alterar el Kernel;
* acceder directamente al Storage;
* alterar el UDM.

---

## Extensiones permitidas

Los Plugins pueden agregar:

* Importadores;
* Exportadores;
* Renderers;
* AI Providers;
* OCR Providers;
* Search Providers;
* Visualizaciones;
* Automatizaciones;
* Integraciones externas.

---

# 5. Reglas

1. Todo Plugin utiliza contratos públicos.
2. Todo Plugin declara permisos.
3. Todo Plugin posee identidad propia.
4. Todo Plugin declara compatibilidad.
5. Ningún Plugin modifica el núcleo.
6. Ningún Plugin accede a implementaciones privadas.
7. Todo Plugin puede desinstalarse sin afectar la Library.

---

# 6. Alternativas consideradas

## Scripts embebidos

Descartados.

No ofrecen aislamiento ni control de permisos.

---

## Modificación directa del código

Descartada.

Compromete la estabilidad del núcleo.

---

## Plugins con acceso total

Descartados.

Contradicen los principios de seguridad y desacoplamiento.

---

# 7. Consecuencias

## Positivas

* Extensibilidad.
* Ecosistema de terceros.
* Núcleo estable.
* Evolución desacoplada.
* Integraciones reutilizables.

## Negativas

* Mayor complejidad del Plugin Engine.
* Necesidad de controlar compatibilidad.
* Gestión de permisos.

---

# 8. Trade-offs

Se prioriza:

* seguridad sobre flexibilidad;
* estabilidad sobre acceso irrestricto;
* contratos públicos sobre integración directa;
* aislamiento sobre rendimiento marginal.

---

# 9. Riesgos

## Plugins incompatibles

Mitigación:

Validación de versión y contratos.

---

## Plugins maliciosos

Mitigación:

Permisos explícitos, aislamiento y revisión opcional.

---

## APIs obsoletas

Mitigación:

Versionado de contratos y políticas de deprecación.

---

# 10. Related Documents

* PluginSDK/
* PublicAPI/
* Contracts/
* ArchitectureConstraints.md
* DocumentationStandards.md

---

# 11. Related ADR

* ADR-001 — Architectural Style
* ADR-005 — Engine Based Architecture
* ADR-006 — AI Architecture
* ADR-012 — Public Contracts
* ADR-015 — Global Identity Model

---

# 12. Status

**Accepted**

La arquitectura de Plugins constituye el único mecanismo oficial para extender KnowledgeOS sin modificar el núcleo.

Toda nueva capacidad extensible deberá implementarse mediante Plugins o justificarse mediante un nuevo Architecture Decision Record.
