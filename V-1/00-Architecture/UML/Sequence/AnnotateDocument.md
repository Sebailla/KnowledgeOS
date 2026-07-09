
# Sequence – Annotate Document

## Objetivo

Describir el proceso mediante el cual un usuario crea una anotación sobre un documento.

---

## Participantes

- Usuario
- UI
- Annotation Engine
- Annotation Repository
- Event Bus
- Render Engine

---

## Flujo principal

1. El usuario crea una anotación.
2. La UI envía la solicitud.
3. El Annotation Engine valida la anotación.
4. La anotación se almacena.
5. Se publica el evento `AnnotationCreated`.
6. El Render Engine actualiza la vista.
7. La UI muestra la anotación.

---

## Flujos alternativos

### Anotación inválida

La operación es rechazada.

### Error de persistencia

Se informa al usuario.

---

## Resultado

La anotación queda asociada al documento.
