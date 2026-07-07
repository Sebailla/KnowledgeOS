
# Import Engine Overview

Versión: 1.0
Estado: Draft

---

# Propósito

Transformar documentos externos en una representación uniforme (UDM).

---

# Flujo

```text
External Document
        │
        ▼
Format Detection
        │
        ▼
Parser
        │
        ▼
Validation
        │
        ▼
UDM
        │
        ▼
Storage Engine
```

# Responsabilidades

- Detectar formato.
- Seleccionar el parser adecuado.
- Construir el UDM.
- Validar el resultado.
- Solicitar la persistencia al Storage Engine.

---

# Eventos publicados

- ImportStarted
- ImportCompleted
- ImportFailed

---

# Eventos consumidos

Ninguno.

---

# Principio Fundamental

Todos los formatos convergen en un único modelo: UDM.
