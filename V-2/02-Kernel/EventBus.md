
# Event Bus

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Distribuir eventos entre los Engines de la plataforma de forma desacoplada.

El Event Bus no implementa lógica de negocio.

---

# Responsabilidades

- Publicar eventos.
- Registrar suscriptores.
- Distribuir eventos.
- Mantener el orden de publicación cuando corresponda.

---

# Flujo

```text
Engine
   │
Publish(Event)
   │
   ▼
Event Bus
   │
   ├────────► Engine A
   ├────────► Engine B
   └────────► Engine C
```

---

# Operaciones

- Publish()
- Subscribe()
- Unsubscribe()

---

# Reglas

- Un Engine no conoce a sus suscriptores.
- Un evento representa un hecho ya ocurrido.
- Un evento puede tener cero o más suscriptores.
- El Event Bus no modifica los eventos.

---

# Garantías

- Entrega dentro del proceso (in-process).
- Distribución síncrona en la versión 1.0.
- La evolución a procesamiento asíncrono no debe romper los contratos existentes.

---

# Relación con otros componentes

```text
Engine
   │
   ▼
Event Bus
   │
   ▼
Subscribers

Engine Registry
   ▲
   │
Lifecycle Manager
```

---

# Principio Fundamental

Los Engines se comunican mediante eventos, nunca mediante referencias directas.
