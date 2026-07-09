
# Sequence – Chat With AI

## Objetivo

Describir el flujo de una conversación entre el usuario y la Inteligencia Artificial utilizando información de la biblioteca mediante RAG.

---

## Participantes

- Usuario
- UI
- AI Engine
- Search Engine
- Library Engine
- AI Provider

---

## Flujo principal

1. El usuario envía una pregunta.
2. La UI envía la consulta al AI Engine.
3. El AI Engine solicita contexto al Search Engine.
4. El Search Engine recupera documentos relevantes.
5. El Library Engine proporciona el contenido solicitado.
6. El AI Engine construye el contexto.
7. Se envía la consulta al proveedor de IA.
8. El proveedor devuelve la respuesta.
9. El AI Engine valida la respuesta.
10. La UI muestra la respuesta al usuario.

---

## Flujos alternativos

### Sin contexto disponible

La IA responde únicamente utilizando el prompt del usuario.

### Proveedor no disponible

Se informa el error y la conversación permanece abierta.

---

## Resultado

El usuario recibe una respuesta generada utilizando conocimiento de su biblioteca.
