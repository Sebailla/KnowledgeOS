
# UDM Specification

Version: 1.0
Status: Draft

---

# Objetivo

Esta carpeta define el Universal Document Model de KnowledgeOS.

El UDM es la representación interna, canónica y portable de todo documento importado.

---

# Documentos

## Modelo central

- UDM.md
- LogicalPhysicalDocument.md
- TypeSystem.md
- Identity.md

## Nodos

- NodeTypes.md
- BlockNodes.md
- InlineNodes.md
- AssetNodes.md
- StructuralNodes.md
- AnnotationNodes.md

## Capas

- StyleLayer.md
- KnowledgeLayer.md
- Provenance.md
- TemporalModel.md

## Relaciones y reglas

- Anchors.md
- Relationships.md
- ConsistencyRules.md
- ValidationRules.md

## Knowledge Graph

- GraphModel.md
- EntityModel.md
- RelationshipModel.md
- Ontology.md
- EmbeddingModel.md
- KnowledgeArchitecture.md

## Persistencia

- Serialization.md
- Versioning.md

---

# Principios

1. El UDM es la fuente de verdad del documento lógico.
2. El documento original nunca se modifica.
3. El Markdown es una representación derivada.
4. El Layout es independiente del contenido.
5. El Style es independiente del contenido.
6. Las anotaciones son independientes del contenido.
7. El Knowledge Graph es derivado.
8. Toda operación debe ser trazable.
9. Todo nodo posee identidad estable.
10. Todo modelo debe poder versionarse.

---

# Estado

UDM v1.0 queda listo para revisión final antes de implementación.
