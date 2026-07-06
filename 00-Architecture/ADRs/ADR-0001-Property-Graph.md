ADR-001 (Primera decisión arquitectónica oficial)

A partir del siguiente libro (Book 03 - Universal Document Model) voy a introducir una práctica que utilizan proyectos grandes y que creo que será uno de los mayores activos del proyecto.

Cada decisión importante quedará registrada como un ADR (Architecture Decision Record).

Ejemplo:

ADR-001
Title:
The Universal Document Model is the canonical representation.

Status:
Accepted

Context:
Documents arrive from multiple incompatible formats.

Decision:
Every imported document SHALL be converted to the UDM.

Consequences:

+ Unified rendering
+ Unified annotations
+ Unified search

- Higher import complexity

Dentro de 5 años, cuando una decisión vuelva a discutirse, no dependeremos de la memoria: tendremos el razonamiento original documentado.
