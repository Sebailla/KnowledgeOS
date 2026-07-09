
# Sequence – Import Document

## Objetivo

Describir el flujo completo de importación de un documento hasta su incorporación a la biblioteca.

---

## Participantes

- Usuario
- UI
- Import Engine
- OCR Adapter
- Structure Analyzer
- UDM Builder
- Validation Service
- Library Engine
- Event Bus

---

## Flujo principal

1. El usuario selecciona un documento.
2. La UI solicita la importación.
3. El Import Engine detecta el formato.
4. Si es necesario ejecuta OCR.
5. Se extrae el contenido.
6. Se analiza la estructura.
7. Se construye el UDM.
8. Se valida el resultado.
9. El Library Engine incorpora el documento.
10. Se publica el evento `DocumentCreated`.
11. La UI actualiza la biblioteca.

---

## Flujos alternativos

### Documento ilegible

Se publica `ImportFailed`.

### OCR fallido

Se cancela la importación.

### UDM inválido

El documento no es incorporado.

---

## Resultado

El documento pasa a formar parte de la Library.
