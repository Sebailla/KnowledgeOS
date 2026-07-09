# Public API

## Objetivo

Definir las APIs públicas de cada Engine.

Estas APIs representan la única forma válida de interacción entre Engines.

---

## Reglas

1. Cada Engine expone una única API pública.
2. Las implementaciones internas permanecen privadas.
3. Ninguna API depende de tecnología concreta.
4. Todas las operaciones deben usar Commands, Queries, Events y DTOs definidos en `Contracts`.
