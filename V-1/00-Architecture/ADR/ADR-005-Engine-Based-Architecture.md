# ADR-005 - Engine-Based Architecture

**Estado:** Accepted

---

# Contexto

El sistema contiene dominios claramente diferenciados.

---

# Decisión

El núcleo se organizará mediante Engines independientes.

Cada Engine tendrá una única responsabilidad.

---

# Engines iniciales

- Import
- Library
- UDM
- Layout
- Annotation
- Search
- Render
- AI
- Sync
- Plugin

---

# Consecuencias

## Positivas

- Modularidad.
- Evolución independiente.
- Testabilidad.

## Negativas

- Mayor coordinación entre componentes.
