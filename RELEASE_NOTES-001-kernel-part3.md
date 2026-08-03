# Sprint 001.3 — Kernel Freeze

## Directorio de instalación

Descomprimir en la raíz del repositorio `KnowledgeOS/`.

## Cambios

- Capability Registry tipado e indexado por provider.
- Detección adicional de ciclos.
- Idempotencia concurrente.
- Event Bus con modo fail-fast opcional.
- Pruebas finales de contratos públicos.
- Versión del paquete elevada a 1.0.0.
- Baseline del Kernel congelada.

## Validación

- packages/domain-types build passed
- packages/contracts build passed
- packages/kernel build passed
- Kernel test compilation passed
- 22 kernel tests passed
