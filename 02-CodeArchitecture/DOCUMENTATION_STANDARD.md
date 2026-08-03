# Code Architecture Documentation Standard

**Version:** 5.6.1  
**Status:** Approved  
**Date:** 2026-08-02

## Purpose

Este estándar se aplica a toda `02-CodeArchitecture`. Cada documento debe explicar una decisión o componente real, establecer límites, incluir trazabilidad y evitar texto promocional o aspiracional sin respaldo en código o ADR.

## Required sections

Purpose, Scope, Architectural Context, Responsibilities, Non-Responsibilities, Conceptual Model, Design and Components, Contracts and APIs, Runtime Flow, Persistence and State, Errors and Recovery, Security and Privacy, Performance and Scalability, Testing and Verification, Traceability y Evolution Rules.

## Minimum quality

- Más de 500 palabras para documentos normativos, salvo índices o diagramas.
- Cabecera con versión, estado, fecha y sección.
- Referencias a paquetes existentes o declaración explícita de que el documento es transversal.
- Sin TODO, TBD ni placeholders.
- PlantUML autocontenido para diagramas nuevos.
- Terminología consistente con contratos y nombres de paquetes.

## Status vocabulary

- **Draft:** contenido incompleto o sujeto a decisión.
- **Proposed:** listo para revisión.
- **Approved:** decisión vigente.
- **Consolidated:** contenido heredado revisado y alineado con el estándar.
- **Deprecated:** no utilizar en implementaciones nuevas.
