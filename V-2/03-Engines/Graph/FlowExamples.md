# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Crear el grafo

1. El Knowledge Engine publica `KnowledgeCreated`.
2. El Graph Engine recibe el evento.
3. Crea el Node correspondiente.
4. Crea las Edges necesarias.
5. Publica `GraphUpdated`.

---

## FE-002 Consulta de vecinos

1. El usuario selecciona un nodo.
2. El Graph Engine ejecuta la consulta.
3. Devuelve los nodos relacionados.

---

## FE-003 Reconstrucción del grafo

1. Se inicia la reconstrucción.
2. Se recorren todos los Knowledge Objects.
3. Se recrean Nodes y Edges.
4. Se valida la integridad.
5. Se publica `GraphRebuilt`.
