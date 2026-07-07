
# Lifecycle Manager

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Administrar el ciclo de vida de todos los Engines registrados.

---

# Responsabilidades

- Inicializar Engines.
- Iniciar la plataforma.
- Detener la plataforma.
- Supervisar el estado de los Engines.
- Coordinar un apagado ordenado.

---

# Ciclo de Vida

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

        ↘
        Failed
```

---

# Operaciones

- Initialize()
- Start()
- Stop()
- Restart()
- GetState()

---

# Reglas

- Un Engine se inicializa una única vez.
- El inicio respeta las dependencias entre Engines.
- Un fallo cambia el estado a **Failed**.
- Un Engine detenido no procesa Commands ni Events.

---

# Relación

```text
Lifecycle Manager
        │
        ▼
 Engine Registry
        │
        ▼
     Engines
```

---

# Principio Fundamental

El Lifecycle Manager controla cuándo un Engine puede ejecutarse, no qué hace.
