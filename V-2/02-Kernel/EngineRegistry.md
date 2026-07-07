
# Engine Registry

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Mantener el registro de todos los Engines disponibles en la plataforma.

El Engine Registry es la única fuente de verdad sobre los Engines registrados.

---

# Responsabilidades

- Registrar Engines.
- Eliminar registros cuando corresponda.
- Consultar Engines registrados.
- Verificar estados.
- Evitar registros duplicados.

---

# Información registrada

Para cada Engine se almacena:

- Identificador.
- Nombre.
- Versión.
- Estado.
- Interfaces expuestas.

---

# Estados

```text
Registered
Initialized
Ready
Running
Stopped
Failed
```

---

# Operaciones

- Register()
- Unregister()
- Get()
- List()
- Exists()

---

# Reglas

- Un Engine solo puede registrarse una vez.
- Cada Engine posee un identificador único.
- El registro no ejecuta lógica del Engine.
- El LifecycleManager controla las transiciones de estado.

---

# Relaciones

```text
LifecycleManager
        │
        ▼
 Engine Registry
        ▲
        │
    All Engines
```

---

# Principio Fundamental

El Engine Registry conoce qué Engines existen.

No conoce cómo funcionan.
