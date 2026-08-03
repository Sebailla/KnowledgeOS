# Sprint 001 — Kernel

## Directorio de instalación

Descomprimir en la raíz del repositorio `KnowledgeOS/`.

## Cambios

- Lifecycle completo y estados estrictos.
- Registro de engines y capabilities.
- Dependencias ordenadas topológicamente.
- Inicio en orden y apagado en orden inverso.
- Rollback de engines iniciados ante fallos.
- Errores tipados y eventos internos.
- Integración con CancellationSource existente.
- Conservación de buses, middleware, retry, idempotencia y unit of work existentes.

## Validación

- packages/domain-types build passed
- packages/contracts build passed
- packages/kernel build passed
- Kernel test compilation passed
- 7 kernel lifecycle tests passed
