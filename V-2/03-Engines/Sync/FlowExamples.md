
# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Sincronización manual

1. El usuario inicia una sincronización.
2. Se detectan cambios locales.
3. Se recuperan cambios remotos.
4. Se resuelven conflictos.
5. Se sincroniza el Workspace.
6. Se publica `SyncCompleted`.

---

## FE-002 Conflicto de edición

1. Se detecta una modificación concurrente.
2. Se genera un conflicto.
3. Se aplica la estrategia configurada.
4. Se valida el resultado.
5. Continúa la sincronización.

---

## FE-003 Reintento tras fallo

1. La sincronización falla.
2. Se registra el error.
3. Se mantiene el estado consistente.
4. El usuario solicita un reintento.
5. Se reinicia la sesión de sincronización.
