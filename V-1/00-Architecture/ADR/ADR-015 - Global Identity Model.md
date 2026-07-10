# ADR-015 — Global Identity Model

**Proyecto:** KnowledgeOS

**Estado:** Accepted

**Versión:** 1.0

---

# 1. Contexto

KnowledgeOS administra un ecosistema de objetos persistentes y derivados.

Ejemplos:

* Knowledge Objects
* UDM Nodes
* Assets
* Annotations
* Collections
* Workspaces
* Entities
* Concepts
* Relationships
* Embeddings
* Jobs
* Workflows
* Plugins

Todos estos elementos deben poder ser identificados de forma única, estable y permanente.

La identidad no puede depender de:

* la ubicación física;
* el nombre del archivo;
* la plataforma;
* la implementación interna.

---

# 2. Decisión

Todo elemento persistente o referenciable del sistema posee una identidad global.

La identidad es:

* única;
* estable;
* inmutable;
* independiente de la persistencia;
* independiente de la plataforma.

La identidad nunca se reutiliza.

---

# 3. Objetivos

El modelo de identidad debe permitir:

* referencias estables;
* sincronización;
* versionado;
* auditoría;
* enlaces permanentes;
* relaciones entre objetos;
* migraciones;
* reconstrucción del Knowledge Graph.

---

# 4. Elementos con identidad

Todo elemento de primer nivel posee identidad propia.

```text
Knowledge Object
Asset
Collection
Workspace
Annotation
Workflow
Job
Plugin
Entity
Concept
Relationship
Embedding
```

---

# 5. Elementos internos

También poseen identidad:

```text
UDM Node
Layout Node
Style Node
Knowledge Node
Anchor
History Entry
Version
```

Esto permite referencias precisas a cualquier parte del conocimiento.

---

# 6. Tipos de Identidad

Cada objeto podrá poseer diferentes tipos de identidad.

## Identity

Identidad permanente.

Nunca cambia.

---

## Version Identity

Identifica una versión específica.

---

## Content Identity

Representa el contenido lógico.

Se basa en hash.

---

## External Identity

Representa identificadores provenientes de sistemas externos.

Ejemplos:

* DOI
* ISBN
* PMID
* ORCID
* UUID externos

---

## Legacy Identity

Permite migraciones desde versiones anteriores.

---

# 7. UUID

La identidad primaria utilizará UUID versión 7.

Características:

* orden temporal;
* unicidad global;
* independencia de la plataforma.

El sistema no dependerá de identificadores autoincrementales.

---

# 8. Content Hash

Además de la identidad permanente, los objetos podrán poseer un Content Hash.

El hash permite:

* detectar duplicados;
* verificar integridad;
* identificar contenido equivalente.

El hash nunca reemplaza a la identidad.

---

# 9. Identidad y Versionado

Una identidad puede poseer múltiples versiones.

```text
KnowledgeObjectID

↓

Version 1

↓

Version 2

↓

Version 3
```

La identidad permanece constante.

---

# 10. Identidad y Sincronización

La sincronización utiliza exclusivamente identidades.

Nunca utiliza:

* nombres;
* rutas;
* índices;
* posiciones.

---

# 11. Identidad y Assets

Los Assets poseen:

* AssetID;
* ContentHash;
* Metadata.

La identidad del Asset permanece estable incluso si cambia su ubicación física.

---

# 12. Identidad y UDM

Todo nodo del UDM posee un NodeID permanente.

Los Anchors utilizan NodeID.

Las anotaciones nunca dependen de páginas ni coordenadas como único mecanismo de referencia.

---

# 13. Identidad y Knowledge Graph

Todo nodo del grafo posee:

* GraphNodeID.

Toda relación posee:

* RelationshipID.

Esto permite reconstrucciones sin perder referencias.

---

# 14. Identidad y Workflows

Todo Workflow posee:

* WorkflowDefinitionID;
* WorkflowInstanceID;
* CorrelationID.

Los pasos del Workflow también poseen identidad.

---

# 15. Identidad y Plugins

Todo Plugin posee:

* PluginID;
* PublisherID;
* VersionID.

Nunca se identifica únicamente por el nombre.

---

# 16. Reglas Fundamentales

1. Toda identidad es única.
2. Toda identidad es permanente.
3. Toda identidad es inmutable.
4. Ninguna identidad depende de la implementación.
5. Ninguna identidad depende de la persistencia.
6. Toda referencia utiliza identidades.
7. Toda sincronización utiliza identidades.
8. Toda relación utiliza identidades.
9. Todo cambio conserva la identidad.
10. El Content Hash nunca reemplaza a la identidad.

---

# 17. Alternativas consideradas

## Identificadores autoincrementales

Descartados.

No permiten sincronización distribuida ni referencias estables.

---

## Hash como identidad

Descartado.

El contenido puede evolucionar.

La identidad debe permanecer.

---

## Nombre de archivo

Descartado.

Los nombres cambian.

No representan identidad.

---

# 18. Consecuencias

## Positivas

* Referencias permanentes.
* Sincronización robusta.
* Versionado limpio.
* Relaciones estables.
* Mayor independencia tecnológica.
* Escalabilidad.

## Negativas

* Mayor complejidad inicial.
* Necesidad de gestionar múltiples tipos de identidad.

---

# 19. Decisiones congeladas

1. Todo objeto relevante posee identidad propia.
2. La identidad es independiente de la persistencia.
3. UUID v7 constituye la identidad primaria.
4. El Content Hash complementa, pero nunca reemplaza, la identidad.
5. Todas las relaciones utilizan identidades.
6. Las migraciones preservan las identidades.
7. Las referencias externas nunca reemplazan las identidades internas.
