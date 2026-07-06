
# Universal Models

Versión: 0.1
Estado: Working Draft

---

# 1. Introducción

KnowledgeOS organiza el conocimiento mediante un conjunto reducido de
modelos universales.

Cada modelo posee una única responsabilidad.

La separación entre modelos constituye uno de los principios
fundamentales de la arquitectura.

---

# 2. Modelos Fundamentales

La arquitectura se compone de los siguientes modelos.

• Universal Document Model (UDM)

• Document Layout Model (DLM)

• Knowledge Graph (KG)

Cada modelo describe un aspecto diferente del mismo conocimiento.

Los modelos nunca compiten entre sí.

Los modelos se complementan.

---

# 3. Universal Document Model (UDM)

El Universal Document Model representa el contenido lógico de un
documento.

Describe:

• estructura

• contenido

• objetos

• relaciones

• anotaciones

• recursos

El UDM nunca almacena información de presentación.

---

# 4. Document Layout Model (DLM)

El Document Layout Model representa la organización visual del documento
original.

Describe:

• páginas

• columnas

• márgenes

• posiciones

• tipografías

• colores

• dimensiones

• encabezados

• pies de página

El DLM preserva la intención visual del autor.

El DLM nunca modifica el contenido lógico.

---

# 5. Knowledge Graph (KG)

El Knowledge Graph representa las relaciones semánticas existentes entre
los Objetos.

El Grafo puede contener relaciones provenientes de:

• la estructura del documento

• referencias bibliográficas

• enlaces

• anotaciones

• inferencias realizadas por IA

• relaciones creadas manualmente por el usuario

El Grafo constituye el modelo utilizado para la exploración del
conocimiento.

---

# 6. Independencia

Cada modelo puede evolucionar independientemente.

La modificación de un modelo no implica cambios obligatorios en los
restantes.

---

# 7. Cooperación

Los modelos cooperan durante todo el ciclo de vida del documento.

El UDM responde a la pregunta:

"¿Qué contiene el documento?"

El DLM responde a la pregunta:

"¿Cómo estaba organizado visualmente?"

El Knowledge Graph responde a la pregunta:

"¿Cómo se relaciona este conocimiento con el resto?"

---

# 8. Representaciones

Ningún modelo define la interfaz de usuario.

Las representaciones visuales se construyen combinando información de los
tres modelos.

Ejemplos:

Vista Libro

→ UDM + DLM

Vista Paper

→ UDM + DLM

Vista Markdown

→ UDM

Vista Web

→ UDM

Vista Grafo

→ KG

Vista Mapa Conceptual

→ KG + UDM

Vista Comparación

→ UDM + DLM + KG

---

# 9. Persistencia

Los modelos podrán almacenarse de forma conjunta o independiente.

La arquitectura no impone una estrategia de persistencia.

Toda implementación deberá garantizar la consistencia entre los modelos.

---

# 10. Evolución

Nuevos modelos podrán incorporarse en el futuro.

La incorporación de un nuevo modelo no deberá invalidar los existentes.

La arquitectura está diseñada para evolucionar sin comprometer la
compatibilidad.
