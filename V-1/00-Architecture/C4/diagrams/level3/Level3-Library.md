# C4 Level 3 – Library Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Gestionar el conocimiento persistente de KnowledgeOS.

El Library Engine constituye el centro del modelo de dominio.

Es el único componente autorizado para modificar la biblioteca.

---

# Responsabilidades

- Gestión de Library
- Gestión de Workspace
- Gestión de Documents
- Gestión de Assets
- Gestión de Collections
- Gestión de Notebooks
- Gestión de Carpetas
- Gestión de Metadata
- Gestión de Tags
- Gestión del Universal Document Model

---

# No es responsable de

- OCR
- IA
- Búsquedas
- Renderizado
- Sincronización
- Exportación

---

# Componentes

## Library Service

API pública.

---

## Document Repository

Persistencia.

---

## Asset Repository

Persistencia de recursos.

---

## Metadata Repository

Persistencia de metadata.

---

## Collection Manager

Organización de documentos.

---

## Workspace Manager

Gestión del espacio de trabajo.

---

## UDM Repository

Acceso al Universal Document Model.

---

## Event Publisher

Publica cambios.

Eventos:

- DocumentCreated
- DocumentUpdated
- DocumentDeleted
- AssetAdded
- AssetRemoved
- CollectionCreated
- MetadataUpdated

---

# Reglas

1. Solo Library modifica el dominio.
2. Ningún Engine escribe directamente en la biblioteca.
3. Todas las modificaciones generan eventos.
4. El UDM siempre permanece consistente.
5. La identidad del documento nunca cambia.

---

# Contratos Públicos

- CreateDocument
- UpdateDocument
- DeleteDocument
- LoadDocument
- SaveDocument
- CreateCollection
- AddAsset
- RemoveAsset
- UpdateMetadata

---

# Decisiones Congeladas

1. Library Engine es el Owner del dominio.
2. Todo documento pertenece a una única Library.
3. El UDM es persistido únicamente por Library.
4. Ningún Engine modifica directamente el almacenamiento.
