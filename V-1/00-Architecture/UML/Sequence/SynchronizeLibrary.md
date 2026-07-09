
# Sequence – Synchronize Library

## Objetivo

Describir el proceso completo de sincronización entre la biblioteca local y el NAS.

---

## Participantes

- Usuario
- UI
- Sync Engine
- Library Engine
- NAS
- Event Bus

---

## Flujo principal

1. El usuario inicia la sincronización.
2. La UI solicita la operación.
3. El Sync Engine detecta cambios.
4. Consulta el estado de la Library.
5. Consulta el NAS.
6. Calcula diferencias.
7. Resuelve conflictos.
8. Replica cambios.
9. Publica `SyncCompleted`.
10. La UI actualiza el estado.

---

## Flujos alternativos

### Sin conexión

La sincronización queda pendiente.

### Conflicto

Se ejecuta la política de resolución definida.

---

## Resultado

La biblioteca local y el NAS quedan sincronizados.
