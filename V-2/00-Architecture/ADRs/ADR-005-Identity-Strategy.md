
# ADR-004 — Identity Strategy

Estado: Accepted

## Contexto

Todos los objetos del sistema requieren identificadores estables para garantizar trazabilidad, referencias y sincronización futura.

## Decisión

Todo objeto persistente tendrá un identificador único e inmutable.

Cada Engine es responsable de generar los IDs de los objetos que administra.

El formato concreto del ID (UUID, ULID, etc.) queda desacoplado de la arquitectura y podrá definirse en la implementación.

## Consecuencias

- Referencias estables.
- Trazabilidad completa.
- Compatibilidad con sincronización futura.
- Independencia del mecanismo de generación.
