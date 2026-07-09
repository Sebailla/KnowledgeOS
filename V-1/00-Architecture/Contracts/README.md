# Contracts

## Objetivo

Definir los contratos públicos utilizados por los Engines de KnowledgeOS.

Los contratos son la única forma válida de comunicación entre componentes.

---

## Tipos de contrato

- Commands
- Queries
- Events
- DTOs
- Errors

---

## Reglas

1. Los contratos son públicos.
2. Las implementaciones son privadas.
3. Todo contrato debe ser versionable.
4. Ningún Engine accede directamente a otro Engine.
5. Ningún contrato debe depender de tecnología concreta.
