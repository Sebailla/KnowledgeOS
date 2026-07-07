# Kernel

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

El Kernel es el núcleo operativo de KnowledgeOS.

Coordina los Engines, administra su ciclo de vida y proporciona los servicios comunes necesarios para el funcionamiento de la plataforma.

No contiene lógica de negocio.

---

# Responsabilidades

- Registrar Engines.
- Inicializar la plataforma.
- Administrar el ciclo de vida.
- Publicar y distribuir eventos.
- Proveer configuración global.
- Coordinar servicios compartidos.

---

# Componentes

- Overview.md
- EngineRegistry.md
- EventBus.md
- LifecycleManager.md
- ConfigurationManager.md

---

# Principio Fundamental

El Kernel coordina la plataforma; los Engines implementan las capacidades.
