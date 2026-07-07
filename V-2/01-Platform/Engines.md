# Engines

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Los Engines son los componentes funcionales de KnowledgeOS.

Cada Engine posee una única responsabilidad, una interfaz pública y un ciclo de vida administrado por el Kernel Engine.

---

# Clasificación

## Core Engines

| Engine    | Responsabilidad                                               |
| --------- | ------------------------------------------------------------- |
| Kernel    | Ciclo de vida, registro de Engines, eventos y configuración. |
| Storage   | Persistencia de datos.                                        |
| Import    | Importación y conversión de documentos al UDM.              |
| Rendering | Representación visual del contenido.                         |

---

## Knowledge Engines

| Engine     | Responsabilidad                               |
| ---------- | --------------------------------------------- |
| Search     | Indexación y búsqueda.                      |
| Annotation | Gestión de anotaciones.                      |
| Knowledge  | Extracción y organización del conocimiento. |
| Graph      | Gestión del grafo de conocimiento.           |

---

## Intelligence Engines

| Engine | Responsabilidad                 |
| ------ | ------------------------------- |
| AI     | Integración con modelos de IA. |

---

## Integration Engines

| Engine | Responsabilidad                             |
| ------ | ------------------------------------------- |
| Plugin | Extensión de capacidades mediante plugins. |
| Sync   | Sincronización (futuro).                   |
| Export | Exportación de datos y conocimiento.       |

---

# Reglas

- Un Engine tiene una única responsabilidad.
- No accede al estado interno de otro Engine.
- Se comunica mediante contratos y eventos.
- Puede evolucionar independientemente.

---

# Ciclo de vida

Todo Engine:

1. Se registra.
2. Se inicializa.
3. Entra en estado Ready.
4. Procesa solicitudes.
5. Se detiene ordenadamente.

---

# Principio Fundamental

Un Engine debe ser pequeño, cohesivo y reemplazable.
