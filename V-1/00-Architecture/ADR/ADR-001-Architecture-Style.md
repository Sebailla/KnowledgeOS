# ADR-001 - Architecture Style

**Estado:** Accepted

---

# Contexto

KnowledgeOS es una plataforma de conocimiento personal que deberá evolucionar durante muchos años.

La arquitectura debe facilitar la incorporación de nuevas capacidades sin modificar el núcleo.

---

# Decisión

KnowledgeOS adoptará una arquitectura modular basada en Engines.

Cada Engine representa un dominio funcional independiente.

La comunicación entre Engines se realizará únicamente mediante contratos públicos.

El UDM será el modelo central compartido.

---

# Consecuencias

## Positivas

- Alta cohesión.
- Bajo acoplamiento.
- Evolución independiente.
- Facilidad para pruebas.
- Sustitución de implementaciones.

## Negativas

- Mayor número de componentes.
- Necesidad de definir contratos claros.

---

# Alternativas consideradas

- Arquitectura por capas.
- Arquitectura MVC.
- Arquitectura basada en microservicios.
- Arquitectura basada en plugins.

Se descartaron por no representar adecuadamente el dominio del producto.
