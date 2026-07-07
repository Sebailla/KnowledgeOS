
# Parser Architecture

Versión: 1.0
Estado: Draft

---

# Propósito

Definir la arquitectura de los parsers del Import Engine.

Todos los parsers convierten un formato externo al Universal Document Model (UDM).

---

# Arquitectura

```text
                Import Engine
                      │
                      ▼
             Parser Registry
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   PDF Parser   Markdown Parser  HTML Parser
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                     UDM
```

---

# Contrato

Todo Parser debe ser capaz de:

- Detectar si soporta un formato.
- Leer el contenido.
- Convertirlo al UDM.
- Reportar errores de validación.

---

# Responsabilidades

Cada Parser:

- conoce únicamente su formato;
- no persiste información;
- no genera conocimiento;
- no renderiza contenido.

---

# Registro

Los Parsers son registrados durante la inicialización del Import Engine.

El Import Engine selecciona automáticamente el Parser adecuado.

---

# Extensibilidad

Agregar un nuevo formato requiere:

1. Implementar un nuevo Parser.
2. Registrar el Parser.
3. Agregar pruebas.
4. Actualizar `SupportedFormats.md`.

No requiere modificar los Parsers existentes.

---

# Principio Fundamental

Cada formato tiene un único Parser responsable de convertirlo al UDM.
