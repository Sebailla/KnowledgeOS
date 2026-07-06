
# ADR-0002

**Título:** El UDM se basa conceptualmente en un Grafo Dirigido con Propiedades (Directed Property Graph)

**Estado:** Aprobado

**Motivación:**

El conocimiento no es una estructura jerárquica simple. Los documentos contienen referencias cruzadas, citas, anotaciones, relaciones semánticas y contenido compartido que se representan de forma más natural mediante un grafo.

**Decisión:**

El Universal Document Model utilizará un grafo dirigido con propiedades como modelo conceptual. La implementación física (SQLite, JSON, Core Data, etc.) queda fuera del alcance de esta decisión.

**Consecuencias:**

* Los Objetos serán nodos.
* Las Relaciones serán aristas con identidad propia.
* El mismo Objeto podrá ser referenciado por múltiples documentos.
* Las anotaciones se anclarán a Objetos, no a páginas.
* Los renderizadores construirán vistas a partir del grafo.
