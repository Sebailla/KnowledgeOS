
# Sequence – Render Document

## Objetivo

Describir el proceso de renderizado de un documento desde el Universal Document Model (UDM) hasta su representación visual.

---

## Participantes

- Usuario
- UI
- Library Engine
- Render Engine
- Layout Manager
- Theme Manager
- Typography Manager
- Media Renderer
- Annotation Engine

---

## Flujo principal

1. El usuario abre un documento.
2. La UI solicita el documento al Library Engine.
3. El Library Engine devuelve el UDM.
4. La UI solicita el renderizado.
5. El Render Engine selecciona el layout.
6. Se aplica el tema.
7. Se aplican las tipografías.
8. Se renderizan imágenes y contenido multimedia.
9. Se incorporan las anotaciones.
10. Se construye la vista final.
11. La UI presenta el documento.

---

## Flujos alternativos

### Recursos multimedia no disponibles

Se muestran marcadores de posición.

### Tipografía no disponible

Se utiliza la fuente por defecto.

---

## Resultado

El documento es representado visualmente sin modificar el UDM.
