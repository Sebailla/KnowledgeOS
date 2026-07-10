
# ADR-006 — AI Architecture

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-006 v1.0

**Related Documents**

* ../ArchitectureModel.md
* ../ArchitecturePrinciples.md
* ../ArchitectureConstraints.md
* ../ArchitectureVocabulary.md
* ../../01-Specifications/AI/

---

# 1. Context

La inteligencia artificial aporta capacidades de alto valor para una plataforma de conocimiento:

* extracción de entidades;
* clasificación;
* resumen;
* traducción;
* OCR;
* generación de embeddings;
* búsqueda semántica;
* asistentes conversacionales.

Sin embargo, los modelos de IA presentan características incompatibles con el dominio como fuente de verdad:

* resultados probabilísticos;
* cambios entre versiones;
* dependencia de proveedores;
* latencia;
* costes;
* disponibilidad variable.

Era necesario integrar IA sin convertirla en un componente central del dominio.

---

# 2. Decisión

La inteligencia artificial constituye una **capacidad opcional** implementada mediante el **AI Engine**.

El dominio nunca dependerá directamente de un proveedor, modelo o servicio de IA.

Todo acceso a IA se realizará exclusivamente a través del AI Engine.

```text
Application
      │
      ▼
AI Engine
      │
      ▼
Provider Manager
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
OpenAI Ollama   MLX / Local
```

---

# 3. Motivación

Separar el dominio de la IA permite:

* independencia tecnológica;
* sustitución de proveedores;
* funcionamiento Offline First;
* pruebas deterministas;
* evolución independiente.

La IA se convierte en un servicio, no en un fundamento del sistema.

---

# 4. Detailed Design

## AI Engine

El AI Engine coordina todas las capacidades relacionadas con modelos de inteligencia artificial.

No contiene lógica del dominio.

Sus responsabilidades son:

* selección de proveedor;
* ejecución de prompts;
* generación de embeddings;
* clasificación;
* extracción de entidades;
* resumen;
* traducción;
* OCR mediante proveedores cuando corresponda;
* administración de contexto;
* registro de resultados.

---

## Provider Manager

El Provider Manager abstrae completamente los proveedores concretos.

Su responsabilidad es:

* descubrir proveedores;
* seleccionar proveedores;
* gestionar credenciales;
* administrar capacidades;
* resolver disponibilidad;
* aplicar políticas de fallback.

El dominio nunca conoce un proveedor específico.

---

## Categorías de proveedores

La arquitectura distingue distintos tipos de proveedores.

### Chat Providers

Ejemplos:

* OpenAI
* Anthropic
* Gemini
* Ollama
* MLX
* LM Studio

---

### Embedding Providers

Responsables de generar representaciones vectoriales.

---

### OCR Providers

Responsables del reconocimiento óptico de caracteres.

Ejemplos:

* Tesseract
* Vision Framework
* Motores futuros

---

### Translation Providers

Responsables de traducción automática.

---

### Classification Providers

Responsables de clasificación y etiquetado.

---

## Capacidades

El AI Engine ofrece capacidades, no modelos.

Ejemplos:

```text
Summarize

Translate

ExtractEntities

GenerateEmbeddings

Classify

AnswerQuestion
```

La implementación concreta depende del proveedor seleccionado.

---

## Model Registry

El AI Engine mantiene un registro de modelos disponibles.

Cada modelo declara:

* ModelID;
* Provider;
* Version;
* Capabilities;
* Context Window;
* Local o Remote;
* Cost Policy.

---

## Prompt Templates

Los prompts forman parte de la aplicación.

Nunca pertenecen al dominio.

Todos los prompts son versionables.

---

## Context Builder

El AI Engine construye el contexto necesario para cada solicitud.

Puede utilizar:

* UDM;
* Metadata;
* Knowledge Graph;
* Collections;
* Workspaces;
* Historial de conversación.

---

## Resultados

Todo resultado generado por IA registra:

* Provider;
* Model;
* Version;
* Timestamp;
* Prompt Version;
* Confidence cuando exista.

Los resultados nunca sustituyen automáticamente el contenido canónico.

---

# 5. Integración con el dominio

La IA puede:

* enriquecer;
* sugerir;
* clasificar;
* resumir;
* recomendar.

La IA nunca:

* modifica automáticamente el UDM;
* altera el Knowledge Object;
* reemplaza decisiones del usuario.

Toda modificación requiere confirmación explícita.

---

# 6. Offline First

La arquitectura prioriza modelos locales.

Cuando existen modelos equivalentes:

1. Local.
2. NAS compartido (si aplica en el futuro).
3. Proveedor remoto.

La ausencia de conectividad no impide utilizar KnowledgeOS.

---

# 7. Seguridad y privacidad

El AI Engine debe permitir:

* excluir contenido sensible;
* anonimizar información;
* limitar envío de datos;
* seleccionar proveedores permitidos.

El usuario conserva siempre el control de qué información sale del dispositivo.

---

# 8. Alternativas consideradas

## Integrar proveedores directamente en cada Engine

Descartado.

Duplica lógica y aumenta el acoplamiento.

---

## Acoplar el dominio a un proveedor específico

Descartado.

Compromete la independencia tecnológica.

---

## IA obligatoria

Descartado.

Contradice el principio Offline First y la visión del producto.

---

# 9. Consecuencias

## Positivas

* Proveedores intercambiables.
* Arquitectura preparada para nuevos modelos.
* Offline First preservado.
* Mayor privacidad.
* Evolución independiente.

## Negativas

* Mayor complejidad inicial.
* Necesidad de abstraer capacidades.
* Gestión adicional de modelos y credenciales.

---

# 10. Trade-offs

Se prioriza:

* independencia tecnológica sobre integración directa;
* estabilidad del dominio sobre automatización;
* privacidad sobre procesamiento remoto;
* capacidades sobre proveedores.

---

# 11. Riesgos

## Cambios en APIs de proveedores

Mitigación:

Adapters específicos y Provider Manager.

---

## Resultados inconsistentes

Mitigación:

Versionado de prompts, registro de modelo y validación por el usuario.

---

## Costes variables

Mitigación:

Políticas de selección y prioridad para modelos locales.

---

# 12. Related Documents

* ArchitecturePrinciples.md
* ArchitectureConstraints.md
* QualityAttributes.md
* AI Specifications
* PromptArchitecture.md
* ContextBuilder.md
* LocalModels.md
* RAG.md

---

# 13. Related ADR

* ADR-001 — Architectural Style
* ADR-003 — Offline First
* ADR-005 — Engine Based Architecture
* ADR-012 — Public Contracts
* ADR-014 — Workflow Engine

---

# 14. Status

**Accepted**

La inteligencia artificial constituye una capacidad transversal implementada exclusivamente mediante el AI Engine.

El dominio permanecerá independiente de cualquier proveedor, modelo o servicio de IA.

Toda evolución futura deberá preservar esta independencia o justificarse mediante un nuevo Architecture Decision Record.
