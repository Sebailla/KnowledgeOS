
# Import Pipeline

Versión: 1.0
Estado: Draft

---

# Propósito

Definir las etapas del proceso de importación.

---

# Pipeline

```text
Select File
      │
      ▼
Detect Format
      │
      ▼
Select Parser
      │
      ▼
Parse
      │
      ▼
Validate UDM
      │
      ▼
Persist Document
      │
      ▼
Publish Event
```

---

# Reglas

- Cada etapa tiene una única responsabilidad.
- Una etapa no conoce la implementación de la siguiente.
- Los errores detienen el pipeline.
- El documento original nunca se modifica.

---

# Resultado

Una importación exitosa produce:

- Document persistido.
- UDM válido.
- Evento `ImportCompleted`.
