# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Crear un Knowledge Object

1. Se recibe un nuevo conocimiento.
2. Se valida el modelo.
3. Se crea el Knowledge Object.
4. Se persiste mediante Storage.
5. Se publica `KnowledgeCreated`.

---

## FE-002 Relacionar dos objetos

1. Se seleccionan dos Knowledge Objects.
2. Se valida la relación.
3. Se crea la relación.
4. Se persiste.
5. Se publica `KnowledgeUpdated`.

---

## FE-003 Eliminar un objeto

1. Se identifica el Knowledge Object.
2. Se eliminan o actualizan sus relaciones según las reglas del modelo.
3. Se elimina el objeto.
4. Se publica `KnowledgeDeleted`.
