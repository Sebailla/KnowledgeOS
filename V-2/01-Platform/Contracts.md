# Contracts

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Definir las reglas de comunicación entre los Engines de KnowledgeOS.

---

# Tipos de contrato

## Commands

Solicitan que un Engine ejecute una acción.

Características:

- tienen un único destinatario;
- pueden devolver un resultado;
- modifican estado.

Ejemplos:

- ImportDocument
- CreateAnnotation
- BuildKnowledgeGraph

---

## Queries

Solicitan información.

Características:

- no modifican estado;
- pueden ejecutarse múltiples veces;
- devuelven datos.

Ejemplos:

- GetDocument
- SearchDocuments
- ListAnnotations

---

## Events

Notifican que ocurrió un hecho.

Características:

- no esperan respuesta;
- pueden tener múltiples suscriptores;
- representan hechos ya ocurridos.

Ejemplos:

- DocumentImported
- AnnotationCreated
- KnowledgeUpdated

---

# Reglas

- Los Engines solo se comunican mediante Contracts.
- No se permite acceso directo al estado interno de otro Engine.
- Los Contracts deben ser estables y versionables.
- Todo Contract debe estar documentado.

---

# Versionado

Los cambios incompatibles requieren una nueva versión del Contract y un ADR si afectan a otros Engines.

---

# Principio Fundamental

Los Contracts desacoplan los Engines y garantizan una evolución independiente.
