
# ADR-014 — Workflow Engine

**Proyecto:** KnowledgeOS
**Estado:** Accepted
**Versión:** 1.0

---

# 1. Contexto

KnowledgeOS ejecuta procesos que involucran múltiples pasos, Engines y operaciones potencialmente largas.

Ejemplos:

* importación de una fuente;
* preprocesamiento;
* OCR;
* análisis de layout;
* construcción del UDM;
* creación del `.kdoc`;
* indexación;
* generación del Knowledge Graph;
* generación de embeddings;
* sincronización;
* exportación.

Estos procesos no pueden representarse correctamente como una única llamada síncrona ni como Jobs independientes sin coordinación.

Se necesita un mecanismo central para definir, ejecutar, supervisar, pausar, reanudar y recuperar procesos compuestos.

---

# 2. Decisión

KnowledgeOS incorporará un **Workflow Engine** como componente del Kernel.

El Workflow Engine coordinará procesos compuestos por múltiples pasos sin implementar la lógica interna de esos pasos.

Cada paso será ejecutado mediante Commands, Queries o contratos públicos de los Engines responsables.

```text
Workflow
    │
    ├── Step 1
    ├── Step 2
    ├── Step 3
    └── Step N
```

---

# 3. Responsabilidad

El Workflow Engine será responsable de:

* registrar definiciones de Workflow;
* crear instancias de ejecución;
* coordinar pasos;
* mantener el estado del proceso;
* registrar progreso;
* ejecutar reintentos;
* pausar y reanudar;
* cancelar cuando sea seguro;
* recuperar ejecuciones interrumpidas;
* publicar eventos de ciclo de vida;
* aplicar compensaciones cuando estén definidas.

---

# 4. Límites

El Workflow Engine no será responsable de:

* ejecutar OCR directamente;
* interpretar documentos;
* construir el UDM;
* modificar Knowledge Objects;
* acceder directamente al Storage;
* resolver lógica de negocio perteneciente a un Engine;
* implementar proveedores externos.

Cada operación continuará perteneciendo al Engine correspondiente.

---

# 5. Workflow y Job

Un **Job** representa una unidad ejecutable individual.

Un **Workflow** representa la coordinación de uno o más Jobs o pasos.

```text
Workflow
    ├── Job
    ├── Job
    └── Job
```

Ejemplo:

```text
Import Knowledge Object Workflow
    │
    ├── Validate Source Job
    ├── Extract Content Job
    ├── OCR Job
    ├── Build UDM Job
    ├── Create KDoc Job
    ├── Index Job
    └── Enrich Knowledge Job
```

---

# 6. Estados

Toda instancia de Workflow podrá encontrarse en uno de los siguientes estados:

* Pending
* Running
* Paused
* Waiting
* Completed
* Failed
* Cancelling
* Cancelled
* Compensating
* Compensated

---

# 7. Estados de los pasos

Cada paso podrá encontrarse en:

* Pending
* Ready
* Running
* Completed
* Failed
* Skipped
* Waiting
* Cancelled
* Compensated

---

# 8. Identidad

Cada Workflow posee:

* WorkflowDefinitionID;
* WorkflowInstanceID;
* WorkflowType;
* WorkflowVersion;
* CorrelationID;
* CreatedAt;
* StartedAt;
* CompletedAt;
* CurrentState.

Cada paso posee:

* StepID;
* StepType;
* Attempt;
* State;
* InputReference;
* OutputReference;
* ErrorReference.

---

# 9. Persistencia

El estado de los Workflows será persistente.

La persistencia deberá permitir:

* recuperación tras cierre inesperado;
* reanudación después de reiniciar la aplicación;
* diagnóstico;
* auditoría;
* consulta del progreso;
* detección de pasos incompletos.

El Workflow Engine utilizará contratos del Storage Layer y nunca accederá directamente a una base de datos concreta.

---

# 10. Eventos

El Workflow Engine publicará, como mínimo:

* WorkflowCreated
* WorkflowStarted
* WorkflowPaused
* WorkflowResumed
* WorkflowCompleted
* WorkflowFailed
* WorkflowCancelled
* WorkflowCompensated
* WorkflowStepStarted
* WorkflowStepCompleted
* WorkflowStepFailed
* WorkflowProgressChanged

Los eventos serán inmutables y versionables.

---

# 11. Errores y reintentos

Cada paso podrá definir:

* número máximo de intentos;
* intervalo entre intentos;
* política de backoff;
* errores reintentables;
* errores definitivos;
* timeout;
* operación de compensación.

Un error en un paso no deberá provocar pérdida silenciosa de estado.

---

# 12. Compensación

Cuando una operación distribuida entre Engines no pueda completarse, el Workflow podrá ejecutar acciones compensatorias.

Ejemplos:

* eliminar un `.kdoc` incompleto;
* liberar Assets temporales;
* revertir un registro provisional;
* restaurar el estado anterior;
* marcar una importación para revisión.

La compensación no reemplaza las transacciones locales.

---

# 13. Idempotencia

Los pasos recuperables deberán ser idempotentes cuando sea posible.

Reejecutar un paso con la misma identidad no deberá:

* crear duplicados;
* corromper estado;
* publicar resultados incompatibles;
* perder información previa.

---

# 14. Workflows iniciales

La primera versión contempla:

* ImportKnowledgeObjectWorkflow
* ReimportKnowledgeObjectWorkflow
* RebuildIndexesWorkflow
* EnrichKnowledgeWorkflow
* SynchronizeLibraryWorkflow
* ExportKnowledgeObjectWorkflow
* MigrateKDocWorkflow
* RestoreLibraryWorkflow

---

# 15. Relación con los Engines

```text
Workflow Engine
    │
    ├── Import Engine
    ├── Library Engine
    ├── Search Engine
    ├── Knowledge Engine
    ├── AI Engine
    ├── Sync Engine
    └── Export Engine
```

El Workflow Engine depende exclusivamente de:

* Kernel;
* Contracts;
* Public APIs.

Nunca depende de implementaciones internas.

---

# 16. Consecuencias positivas

* Procesos largos recuperables.
* Coordinación explícita entre Engines.
* Progreso observable.
* Reintentos controlados.
* Mayor tolerancia a fallos.
* Separación entre orquestación y lógica del dominio.
* Mejor trazabilidad.
* Posibilidad de ejecución en segundo plano.

---

# 17. Consecuencias negativas

* Mayor complejidad en el Kernel.
* Necesidad de persistir estados intermedios.
* Necesidad de diseñar operaciones idempotentes.
* Mayor cantidad de eventos.
* Necesidad de definir políticas de compensación.

---

# 18. Alternativas consideradas

## Jobs independientes sin orquestación

Descartado porque no representa dependencias, progreso global ni recuperación coordinada.

## Orquestación dentro de cada Engine

Descartado porque duplicaría mecanismos y aumentaría el acoplamiento.

## Llamadas síncronas encadenadas

Descartado porque no soporta adecuadamente procesos largos, interrupciones ni trabajo en segundo plano.

## Motor externo de Workflows

Postergado. Introduciría una dependencia operativa innecesaria para la primera versión Offline First.

---

# 19. Decisiones congeladas

1. El Workflow Engine forma parte del Kernel.
2. Un Workflow coordina pasos pertenecientes a distintos Engines.
3. Un Job representa una unidad de ejecución individual.
4. El estado de los Workflows es persistente.
5. Los Workflows deben poder recuperarse y reanudarse.
6. La lógica del dominio permanece dentro de los Engines.
7. Toda interacción utiliza contratos públicos.
8. Los pasos recuperables deben ser idempotentes cuando sea posible.
9. Los fallos pueden activar operaciones compensatorias.
10. Los Workflows publican eventos de ciclo de vida y progreso.
