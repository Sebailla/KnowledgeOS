# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Crear una nota

1. El usuario selecciona contenido.
2. Se crea un Anchor.
3. Se crea la anotación.
4. Se persiste mediante Storage.
5. Se publica `AnnotationCreated`.

---

## FE-002 Resaltar texto

1. El usuario selecciona un rango.
2. Se registra el Anchor.
3. Se crea una anotación de tipo `Highlight`.
4. El Rendering Engine actualiza la vista.

---

## FE-003 Eliminar una anotación

1. El usuario elimina la anotación.
2. Se elimina del Storage.
3. Se publica `AnnotationDeleted`.
4. El Rendering Engine actualiza la vista.
