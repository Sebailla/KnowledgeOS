# Plugin Engine Overview

Versión: 1.0
Estado: Draft

---

# Propósito

Coordinar el ciclo de vida completo de los plugins.

---

# Responsabilidades

- Registrar plugins.
- Resolver dependencias.
- Administrar permisos.
- Gestionar versiones.

---

# Eventos publicados

- PluginLoaded
- PluginStarted
- PluginStopped
- PluginUnloaded

---

# Eventos consumidos

- ApplicationStarted
- ApplicationStopped

---

# Principio Fundamental

El Plugin Engine desacopla las extensiones del núcleo de KnowledgeOS.
