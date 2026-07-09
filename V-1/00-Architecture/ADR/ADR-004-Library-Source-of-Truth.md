
# ADR-004 - Library and Source of Truth

**Estado:** Accepted

---

# Contexto

La biblioteca debe preservar la integridad de los documentos y permitir sincronización.

---

# Decisión

Cada biblioteca tendrá una única Source of Truth.

Inicialmente será un NAS.

Los documentos originales permanecerán inmutables.

La biblioteca almacenará únicamente el conocimiento procesado y sus metadatos.

---

# Consecuencias

## Positivas

- Integridad.
- Sincronización consistente.
- Recuperación sencilla.

## Negativas

- Gestión adicional de cachés locales.

---

# Alternativas consideradas

- Copiar todos los documentos.
- Modificar documentos originales.

Descartadas.
