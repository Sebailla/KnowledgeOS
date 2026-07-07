
# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Persistir un documento

1. El Import Engine genera un UDM válido.
2. Solicita persistencia al Storage Engine.
3. El Storage Engine inicia una transacción.
4. El Repository almacena el documento.
5. Se confirma la transacción.
6. Se publica `ObjectCreated`.

---

## FE-002 Restaurar un Workspace

1. El usuario selecciona un backup.
2. El Storage Engine valida la integridad.
3. Se ejecutan migraciones si son necesarias.
4. El Workspace queda disponible.

---

## FE-003 Ejecutar una migración

1. Detectar la versión actual.
2. Identificar migraciones pendientes.
3. Ejecutarlas en orden.
4. Validar la integridad.
5. Actualizar la versión del esquema.
