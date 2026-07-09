
# ADR-009 - Synchronization Strategy

**Estado:** Accepted

---

# Contexto

KnowledgeOS debe permitir trabajar desde múltiples dispositivos sin comprometer la integridad de la biblioteca.

La sincronización no debe modificar el contenido del conocimiento.

Debe soportar largos períodos de trabajo offline.

---

# Decisión

La sincronización será un proceso independiente del dominio.

El Sync Engine sincroniza exclusivamente los cambios persistidos.

Los Engines nunca realizan sincronización directamente.

---

# Principios

- Offline First.
- Sincronización asíncrona.
- Source of Truth única.
- Sin bloqueo permanente.
- Operación incremental.

---

# Unidad de sincronización

La unidad mínima de sincronización es un objeto identificado.

Ejemplos:

- Documento
- Asset
- Anotación
- Metadata

Nunca la biblioteca completa.

---

# Tipos de datos

## Persistentes

- UDM
- Annotations
- Metadata
- Assets

## Regenerables

- Layout
- Search Index
- Cache

Los datos regenerables nunca se sincronizan.

---

# Resolución de conflictos

Los conflictos nunca modifican automáticamente el contenido.

Cada conflicto genera un evento para resolución.

---

# Responsabilidades

Sync Engine

- detectar cambios
- transmitir cambios
- recibir cambios
- resolver conflictos
- registrar sincronizaciones

Library Engine

- aplicar cambios aceptados

---

# Consecuencias

## Positivas

- Escalable.
- Robusto.
- Independiente del almacenamiento.
- Compatible con trabajo offline.

## Negativas

- Mayor complejidad.
- Gestión de conflictos.

---

# Alternativas consideradas

Sincronización completa de biblioteca.

Descartada por ineficiente.

Sincronización basada en archivos.

Descartada por insuficiente para UDM y anotaciones.

---

# Decisiones congeladas

1. La sincronización pertenece exclusivamente al Sync Engine.
2. La sincronización es incremental.
3. El contenido nunca se modifica automáticamente.
4. Los conflictos son explícitos.
5. Layout, índices y cachés no se sincronizan.
