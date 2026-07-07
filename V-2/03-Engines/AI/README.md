# AI Engine

Versión: 1.0
Estado: Draft
Última actualización: 2026-07-07

---

# Propósito

El AI Engine coordina la interacción entre KnowledgeOS y los distintos proveedores de Inteligencia Artificial.

Su responsabilidad es ejecutar tareas de IA, procesar resultados y devolver respuestas estructuradas al resto de la plataforma.

El AI Engine nunca constituye la fuente de verdad del sistema.

---

# Responsabilidades

- Orquestar solicitudes a modelos de IA.
- Gestionar proveedores de IA.
- Construir el contexto de una solicitud.
- Validar respuestas.
- Publicar resultados.

---

# No es responsable de

- Persistir información.
- Crear Knowledge Objects directamente.
- Modificar documentos.
- Administrar el Graph.
- Administrar índices.

---

# Componentes

- Overview.md
- AIProviders.md
- ContextBuilder.md
- PromptPipeline.md
- ResponseValidation.md
- Tasks.md
- SequenceDiagrams.md
- StateDiagrams.md
- InterfaceContracts.md
- FlowExamples.md

---

# Principio Fundamental

La IA genera propuestas; el resto de la plataforma decide cómo utilizarlas.
