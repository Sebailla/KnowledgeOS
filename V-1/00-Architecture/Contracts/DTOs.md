# DTOs

## Objetivo

Definir objetos de transferencia entre Engines.

---

# Core DTOs

## DocumentDTO

- id
- title
- status
- metadata
- createdAt
- updatedAt

## UDMDocumentDTO

- id
- documentId
- nodes

## UDMNodeDTO

- id
- type
- parentId
- order
- content

## AssetDTO

- id
- documentId
- type
- hash
- location

## AnnotationDTO

- id
- documentId
- udmNodeId
- type
- anchor
- payload

## SearchResultDTO

- documentId
- nodeId
- title
- snippet
- score

## JobDTO

- id
- type
- status
- progress
- error

## PluginDTO

- id
- name
- version
- status
- permissions
