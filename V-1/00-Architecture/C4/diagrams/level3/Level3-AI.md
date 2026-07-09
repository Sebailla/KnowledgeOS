
# C4 Level 3 – AI Engine

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Orquestar todas las capacidades de Inteligencia Artificial de KnowledgeOS mediante una interfaz unificada, independientemente del proveedor o del modelo utilizado.

El AI Engine no implementa modelos de IA; coordina su utilización.

---

# Responsabilidades

- Gestionar proveedores de IA.
- Seleccionar modelos.
- Gestionar conversaciones.
- Ejecutar RAG.
- Generar resúmenes.
- Traducir contenido.
- Clasificar documentos.
- Extraer entidades.
- Generar embeddings.
- Administrar prompts.
- Gestionar contexto.

---

# No es responsable de

- Persistencia.
- Búsqueda.
- Renderizado.
- Sincronización.
- OCR.
- Importación.

---

# Componentes

## AI Service

API pública del Engine.

---

## Provider Manager

Gestiona proveedores de IA.

---

## Model Manager

Selecciona el modelo adecuado para cada operación.

---

## Prompt Manager

Gestiona plantillas de prompts.

---

## Context Builder

Construye el contexto enviado al modelo.

---

## RAG Pipeline

Recupera información relevante desde la biblioteca.

---

## Embedding Manager

Genera y administra embeddings.

---

## Conversation Manager

Gestiona el historial conversacional.

---

## Response Validator

Valida las respuestas antes de devolverlas.

---

## Event Publisher

Publica eventos relacionados con operaciones de IA.

---

# Capacidades

- Chat
- RAG
- Summarization
- Translation
- Classification
- Entity Extraction
- Keyword Extraction
- Embeddings

---

# Contratos Públicos

- Chat
- Ask
- Summarize
- Translate
- Classify
- GenerateEmbedding
- ExecuteRAG

---

# Eventos Publicados

- ChatCompleted
- SummaryGenerated
- TranslationCompleted
- ClassificationCompleted
- EmbeddingGenerated

---

# Reglas

1. Toda operación utiliza un proveedor de IA configurable.
2. Ninguna respuesta modifica automáticamente la biblioteca.
3. El contexto se construye antes de invocar un modelo.
4. El AI Engine no accede directamente al almacenamiento.
5. Todo resultado debe poder ser trazado al proveedor y modelo utilizados.

---

# Dependencias

- Library Engine
- Search Engine
- Event Bus
- Modelos Locales
- Servicios de IA

---

# Decisiones Congeladas

1. El AI Engine es un orquestador.
2. Los proveedores son intercambiables.
3. El RAG utiliza únicamente información de la biblioteca.
4. La IA nunca modifica automáticamente el conocimiento persistente.
