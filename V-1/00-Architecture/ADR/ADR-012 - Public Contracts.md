
# ADR-012 - Public Contracts

**Estado:** Accepted

---

# Contexto

Cada Engine debe evolucionar de forma independiente.

Para lograrlo es necesario establecer contratos públicos estables.

---

# Decisión

Todo acceso entre Engines se realiza exclusivamente mediante contratos públicos.

Ningún Engine podrá acceder a implementaciones internas de otro Engine.

---

# Tipos de contratos

- Commands
- Queries
- Events
- Services
- DTOs

---

# Reglas

Los contratos:

- son públicos
- son estables
- son independientes de la implementación
- son versionables
- son documentables

---

# Implementaciones

Las implementaciones son privadas.

Pueden cambiar sin afectar al resto del sistema.

---

# Versionado

Todo cambio incompatible requiere una nueva versión del contrato.

---

# Dependencias

Los Engines dependen únicamente de contratos.

Nunca dependen de implementaciones concretas.

---

# Responsabilidades

Cada Engine define:

- sus Commands
- sus Queries
- sus Events
- sus DTOs

---

# Consecuencias

## Positivas

- Bajo acoplamiento.
- Evolución independiente.
- Mejor testabilidad.
- Plugins más simples.

## Negativas

- Mayor disciplina en el diseño.
- Gestión del versionado.

---

# Alternativas consideradas

Acceso directo entre Engines.

Descartado por romper el encapsulamiento.

---

# Decisiones congeladas

1. Toda interacción utiliza contratos públicos.
2. Las implementaciones son privadas.
3. Los contratos son versionables.
4. Los Engines nunca dependen de implementaciones.
5. Todo contrato debe documentarse.
