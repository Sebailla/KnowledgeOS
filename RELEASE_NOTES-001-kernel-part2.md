# Sprint 001.2 — Kernel Runtime

## Directorio de instalación

Descomprimir en la raíz del repositorio `KnowledgeOS/`.

## Cambios

- Command Bus y Query Bus tipados.
- Event Bus con aislamiento de fallos.
- Execution Context y contextos derivados.
- CancellationSource idempotente.
- Middleware compuesto y protección de next().
- Retry cancelable con scheduler explícito.
- Idempotencia in-memory.
- Unit of Work.
- Generador monotónico de IDs.
- Pruebas integrales del runtime.

## Validación

- packages/domain-types build passed
- packages/contracts build passed
- packages/kernel build passed
- Kernel test compilation passed
- 17 kernel tests passed
