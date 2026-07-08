
# ADR-005 — Graph Persistence Strategy

Estado: Accepted

## Contexto

El Knowledge Graph puede:

1. Persistirse como parte del Workspace.
2. Reconstruirse a partir de los Knowledge Objects.

Ambas estrategias son válidas y presentan ventajas e inconvenientes.

## Decisión

En KnowledgeOS 1.0 el Knowledge Graph será **persistente**.

El Graph Engine será el responsable exclusivo de mantener su consistencia.

Si el grafo requiere reconstrucción, ésta será una operación explícita de mantenimiento, no el comportamiento normal de la plataforma.

## Justificación

Persistir el grafo proporciona:

- apertura inmediata del Workspace;
- consultas más rápidas;
- independencia respecto al proceso de reconstrucción;
- mejor experiencia de usuario.

La consistencia se garantiza mediante el Graph Engine y las migraciones del Storage Engine.

## Consecuencias

### Ventajas

- Inicio más rápido.
- Mejor rendimiento de consultas.
- Menor carga de procesamiento.

### Desventajas

- Mayor tamaño del Workspace.
- Necesidad de mantener sincronizado el grafo.
- Mayor complejidad en migraciones.

## Revisión

Esta decisión podrá revisarse si futuras versiones demuestran que la reconstrucción incremental ofrece ventajas significativas.
