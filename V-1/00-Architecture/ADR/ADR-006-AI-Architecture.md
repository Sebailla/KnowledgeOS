# ADR-006 - AI Architecture

**Estado:** Accepted

---

# Contexto

La IA forma parte del producto, pero no debe condicionar su funcionamiento.

---

# Decisión

La IA será un servicio desacoplado del núcleo.

Operará exclusivamente sobre el UDM.

El sistema deberá funcionar completamente sin IA.

---

# Consecuencias

## Positivas

- Flexibilidad.
- Sustitución de modelos.
- Procesamiento local o remoto.

## Negativas

- Mayor complejidad de integración.
