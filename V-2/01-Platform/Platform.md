
# Platform

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

Documentos relacionados:

- README.md
- Workspace.md
- Engines.md
- DataFlow.md

---

# 1. Propósito

KnowledgeOS está organizado como una plataforma modular compuesta por Engines especializados.

Cada Engine posee una única responsabilidad y colabora con los demás mediante contratos y eventos.

La plataforma coordina estos Engines para ofrecer una experiencia unificada al usuario.

---

# 2. Organización General

```text
                    KnowledgeOS
                         │
                  Platform Kernel
                         │
 ┌──────────┬──────────┬──────────┬──────────┬──────────┐
 │          │          │          │          │          │
Import   Storage   Rendering   Search   Knowledge   Graph
Engine    Engine     Engine     Engine     Engine    Engine
 │
 ├────────── Annotation Engine
 ├────────── AI Engine
 ├────────── Plugin Engine
 └────────── Sync Engine (futuro)
```

---

# 3. Responsabilidades

## Platform

Responsable de:

- iniciar la aplicación;
- administrar los Engines;
- coordinar el ciclo de vida;
- gestionar la configuración global;
- distribuir eventos.

No implementa lógica de negocio.

---

# 4. Reglas de organización

- Cada responsabilidad pertenece a un único Engine.
- Los Engines son independientes.
- La comunicación se realiza mediante contratos y eventos.
- Ningún Engine accede al estado interno de otro.

---

# 5. Clasificación de Engines

## Core Engines

Imprescindibles para el funcionamiento.

- Kernel
- Storage
- Import
- Rendering

---

## Knowledge Engines

Transforman documentos en conocimiento.

- Search
- Annotation
- Knowledge
- Graph

---

## Intelligence Engines

Añaden capacidades inteligentes.

- AI
- Embedding (futuro)
- Reasoning (futuro)

---

## Integration Engines

Amplían la plataforma.

- Plugin
- Sync
- Export
- API

---

# 6. Dependencias

Las dependencias son unidireccionales.

```text
UI
 ↓
Platform
 ↓
Engines
 ↓
Repositories
 ↓
Storage
```

No se permiten dependencias circulares.

---

# 7. Evolución

La incorporación de un nuevo Engine requiere:

1. Definir su responsabilidad.
2. Documentar sus contratos.
3. Definir los eventos que publica y consume.
4. Crear un ADR si modifica la arquitectura.

---

# 8. Principio Fundamental

La plataforma coordina capacidades.

Los Engines implementan capacidades.
