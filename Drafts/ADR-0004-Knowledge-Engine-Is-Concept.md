
# ADR-0004

Título

Knowledge Engine como concepto arquitectónico

Estado

Accepted

## Contexto

Inicialmente el Knowledge Engine fue modelado como un componente
coordinador.

Durante el diseño se observó que esta aproximación concentraba demasiadas
responsabilidades y favorecía la aparición de un God Object.

## Decisión

El Knowledge Engine deja de considerarse un componente concreto.

A partir de esta decisión se define como el conjunto de componentes que
implementan el dominio de KnowledgeOS.

Las Operations coordinan el trabajo.

Los Managers implementan las reglas de negocio.

Las Transactions garantizan consistencia.

Los Repositories abstraen la persistencia.

## Consecuencias

Se elimina un punto único de coordinación.

La arquitectura gana cohesión.

Las responsabilidades quedan claramente distribuidas.
