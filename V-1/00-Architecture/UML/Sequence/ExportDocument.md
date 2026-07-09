
# Sequence – Export Document

## Objetivo

Describir el proceso de exportación de un documento desde la biblioteca hacia un formato externo.

---

## Participantes

- Usuario
- UI
- Export Engine
- Library Engine
- Render Engine

---

## Flujo principal

1. El usuario selecciona el formato.
2. La UI solicita la exportación.
3. El Export Engine obtiene el documento.
4. El Library Engine devuelve el UDM.
5. El Render Engine genera la representación.
6. El Export Engine crea el archivo.
7. La UI entrega el archivo al usuario.

---

## Resultado

Se genera un archivo independiente del documento original.
