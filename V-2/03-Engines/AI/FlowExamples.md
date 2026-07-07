# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Resumir un documento

1. El usuario solicita un resumen.
2. El AI Engine construye el contexto.
3. Selecciona un proveedor compatible.
4. Ejecuta la tarea.
5. Valida la respuesta.
6. Devuelve el resultado al usuario.

---

## FE-002 Extraer entidades

1. Se recibe una solicitud de extracción.
2. Se construye el contexto a partir del UDM.
3. El proveedor ejecuta la inferencia.
4. Se normaliza la respuesta.
5. Se devuelve la lista de entidades.

---

## FE-003 Cancelar una tarea

1. El usuario cancela una solicitud.
2. El AI Engine marca la tarea como cancelada.
3. Si el proveedor admite cancelación, se propaga la solicitud.
4. Se publica `AIRequestFailed` con motivo `Cancelled`.
