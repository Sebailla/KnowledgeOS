# Sync Engine Overview

Versión: 1.0
Estado: Draft

---

# Propósito

Mantener sincronizadas distintas copias de un Workspace.

---

# Entradas

- Eventos del Workspace.
- Cambios locales.
- Cambios remotos.

---

# Salidas

- Cambios sincronizados.
- Conflictos detectados.
- Estado de sincronización.

---

# Responsabilidades

- Detectar diferencias.
- Programar sincronizaciones.
- Coordinar adaptadores.
- Resolver conflictos.

---

# Eventos publicados

- SyncStarted
- SyncCompleted
- SyncFailed
- ConflictDetected

---

# Eventos consumidos

- WorkspaceChanged
- ConnectionAvailable

---

# Principio Fundamental

La sincronización es un proceso eventual y tolerante a fallos.
