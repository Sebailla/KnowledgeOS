
# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Apertura de un documento

1. El usuario abre un documento.
2. Se recupera el UDM desde Storage.
3. El Rendering Engine calcula el layout.
4. Se aplica el tema activo.
5. Se renderiza la vista.

---

## FE-002 Cambio de tema

1. El usuario selecciona un nuevo tema.
2. Se publica `ThemeChanged`.
3. El Rendering Engine invalida la vista.
4. Se vuelve a renderizar el documento.
5. Se actualiza la interfaz.

---

## FE-003 Actualización del documento

1. El documento cambia.
2. Se publica `DocumentUpdated`.
3. Se recalcula el layout.
4. Se actualizan únicamente las regiones afectadas.
