
# C4 Level 3 – Search Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Permitir localizar conocimiento de forma rápida y precisa sobre toda la biblioteca.

El Search Engine es responsable exclusivamente de la indexación y recuperación de información.

No es propietario de ningún dato del dominio.

---

# Responsabilidades

- Construcción de índices.
- Actualización de índices.
- Eliminación de índices obsoletos.
- Búsqueda Full Text.
- Búsqueda por metadata.
- Búsqueda estructural.
- Búsqueda semántica.
- Ranking de resultados.
- Filtros.
- Sugerencias.

---

# No es responsable de

- Persistencia.
- Modificación de documentos.
- IA conversacional.
- Renderizado.
- Sincronización.
- Exportación.

---

# Componentes

## Search Service

API pública del Engine.

---

## Index Manager

Gestiona todos los índices.

---

## Full Text Index

Índice de contenido textual.

---

## Metadata Index

Índice de metadata.

---

## Semantic Index

Índice vectorial para búsqueda semántica.

---

## Query Processor

Analiza y normaliza las consultas.

---

## Ranking Engine

Ordena los resultados.

---

## Filter Engine

Aplica filtros sobre los resultados.

---

## Suggestion Engine

Genera sugerencias y autocompletado.

---

## Event Subscriber

Actualiza índices a partir de eventos del Library Engine.

---

# Flujo

1. Recibir consulta.
2. Procesar consulta.
3. Seleccionar índices.
4. Ejecutar búsqueda.
5. Aplicar filtros.
6. Calcular ranking.
7. Generar resultados.

---

# Eventos Consumidos

- DocumentCreated
- DocumentUpdated
- DocumentDeleted
- MetadataUpdated
- AssetAdded
- AssetRemoved

---

# Contratos Públicos

- Search
- FullTextSearch
- SemanticSearch
- SearchByMetadata
- Suggest
- RebuildIndexes

---

# Reglas

1. Nunca modifica documentos.
2. Nunca persiste conocimiento.
3. Todos los índices pueden regenerarse.
4. La búsqueda nunca modifica el dominio.
5. Los índices son derivados del Library Engine.

---

# Dependencias

- Library Engine
- AI Engine (búsqueda semántica)
- Event Bus

---

# Decisiones Congeladas

1. Search Engine no es propietario de datos.
2. Los índices son reconstruibles.
3. Toda indexación deriva del Library Engine.
4. Toda consulta utiliza contratos públicos.
