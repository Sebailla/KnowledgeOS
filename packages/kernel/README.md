# @knowledgeos/kernel

Kernel de ciclo de vida para KnowledgeOS.

## Responsabilidades

- Registro de engines.
- Validación y ordenamiento topológico de dependencias.
- Inicialización y arranque deterministas.
- Detención y liberación en orden inverso.
- Estados de ciclo de vida estrictos.
- Errores tipados.
- Eventos internos observables.
- Rollback básico cuando falla el arranque.

## API pública

```ts
import {
  KernelBuilder,
  type Engine,
} from "@knowledgeos/kernel";
```

## Ciclo de vida

```text
Created
→ Initializing
→ Initialized
→ Starting
→ Running
→ Stopping
→ Stopped
→ Disposing
→ Disposed
```

Un fallo durante cualquier fase mueve el Kernel a `Failed`. El llamador puede
detener o liberar el runtime de forma explícita.

## Dependencias

Las dependencias se expresan mediante `Engine.dependencies`. El Kernel detecta:

- dependencias ausentes;
- ciclos;
- orden de inicialización incorrecto.

El arranque sigue el orden de dependencias. La detención y liberación usan el
orden inverso.

## Runtime primitives

El paquete también contiene las primitivas de ejecución compartidas:

- `CommandBus`
- `QueryBus`
- `EventBus`
- `ExecutionContext`
- `CancellationSource`
- middleware compuesto
- retry cancelable
- idempotencia
- unit of work
- generación monotónica de identificadores

Los buses son deliberadamente in-memory y libres de infraestructura. La
persistencia, distribución y transporte pertenecen a adaptadores externos.
