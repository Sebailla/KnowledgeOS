
# Lifecycle

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Define el ciclo de vida de los objetos principales gestionados por KnowledgeOS.

---

# Document Lifecycle

```text
Imported
    ↓
Parsed
    ↓
Structured (UDM)
    ↓
Indexed
    ↓
Knowledge Ready
    ↓
Graph Ready
    ↓
Archived
```

---

# Engine Lifecycle

```text
Registered
    ↓
Initialized
    ↓
Ready
    ↓
Running
    ↓
Stopped
```

---

# Workspace Lifecycle

```text
Created
    ↓
Opened
    ↓
Active
    ↓
Closed
```

---

# Reglas

- Los estados son secuenciales.
- Un estado no puede omitirse sin justificación.
- Un error no invalida el objeto completo.
- El documento original permanece siempre accesible.
- Los cambios de estado generan eventos.

---

# Principio Fundamental

Todo objeto administrado por la plataforma posee un ciclo de vida explícito y observable.
