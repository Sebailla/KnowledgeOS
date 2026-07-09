
# C4 Level 3 – Sync Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Sincronizar de forma confiable la biblioteca local con el NAS, garantizando el funcionamiento Offline First y preservando la integridad del conocimiento.

El Sync Engine es el único responsable de la sincronización entre dispositivos.

---

# Responsabilidades

- Detectar cambios locales.
- Detectar cambios remotos.
- Planificar sincronizaciones.
- Resolver conflictos.
- Replicar documentos.
- Replicar assets.
- Replicar metadata.
- Gestionar versiones.
- Recuperar sincronizaciones interrumpidas.
- Registrar el estado de sincronización.

---

# No es responsable de

- Modificar documentos.
- Importar documentos.
- Renderizar contenido.
- Ejecutar IA.
- Gestionar la biblioteca.

---

# Componentes

## Sync Service

API pública del Engine.

---

## Change Detector

Detecta modificaciones locales y remotas.

---

## Sync Planner

Calcula las operaciones necesarias para sincronizar ambos extremos.

---

## Conflict Resolver

Resuelve conflictos entre versiones.

---

## Transfer Manager

Gestiona la transferencia de información.

---

## Version Manager

Administra las versiones de los documentos.

---

## Sync Queue

Gestiona las operaciones pendientes.

---

## Recovery Manager

Recupera sincronizaciones interrumpidas.

---

## Event Publisher

Publica eventos del proceso de sincronización.

---

# Flujo

1. Detectar cambios.
2. Construir el plan de sincronización.
3. Resolver conflictos.
4. Ejecutar transferencias.
5. Actualizar versiones.
6. Publicar eventos.

---

# Eventos Publicados

- SyncStarted
- SyncCompleted
- SyncFailed
- ConflictDetected
- ConflictResolved
- DocumentSynchronized

---

# Contratos Públicos

- Synchronize
- SynchronizeDocument
- SynchronizeLibrary
- GetSynchronizationStatus
- ResolveConflict
- RetrySynchronization

---

# Reglas

1. El NAS constituye la Source of Truth.
2. Ningún documento se elimina sin validación.
3. Toda sincronización es transaccional.
4. Toda sincronización puede reanudarse.
5. Todos los conflictos quedan registrados.

---

# Dependencias

- Library Engine
- Event Bus
- NAS

---

# Decisiones Congeladas

1. El Sync Engine es el único responsable de la sincronización.
2. Toda sincronización parte del estado de la Library.
3. El NAS mantiene la versión canónica de la biblioteca.
4. El funcionamiento Offline First es obligatorio.
