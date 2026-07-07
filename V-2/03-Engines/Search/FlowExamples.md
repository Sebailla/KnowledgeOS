# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Búsqueda por texto

1. El usuario introduce una consulta.
2. El Search Engine valida la consulta.
3. Selecciona el índice de texto.
4. Ejecuta la búsqueda.
5. Calcula el ranking.
6. Devuelve los resultados.

---

## FE-002 Documento importado

1. El Import Engine publica `ImportCompleted`.
2. El Search Engine recibe el evento.
3. Actualiza los índices afectados.
4. El documento queda disponible para búsquedas.

---

## FE-003 Reconstrucción de índices

1. Se inicia una reconstrucción.
2. Se eliminan los índices existentes.
3. Se recorren los documentos persistidos.
4. Se generan nuevos índices.
5. Se publican los índices actualizados.
