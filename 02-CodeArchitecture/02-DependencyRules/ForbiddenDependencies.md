# Forbidden Dependencies

**Project:** KnowledgeOS  
**Section:** `02-CodeArchitecture/02-DependencyRules`  
**Document:** `ForbiddenDependencies.md`  
**Documentation version:** 5.6.1  
**Status:** Consolidated  
**Last updated:** 2026-08-02  
**Implemented by:** `packages/contracts`, `packages/domain-types`, `packages/kernel`

## 1. Purpose

Las dependencias deben apuntar hacia contratos más estables; ninguna conveniencia local justifica un ciclo entre paquetes. Establece la razón de existencia del documento y la decisión de ingeniería que gobierna. Este documento convierte una descripción breve en una especificación verificable y mantiene la terminología de KnowledgeOS.

## 2. Scope

Cubre **Forbidden Dependencies** dentro de **Reglas de dependencias**. Define la dirección permitida de dependencias, visibilidad modular, contratos entre lenguajes y prohibiciones arquitectónicas. Delimita los componentes, flujos y consumidores cubiertos, evitando convertir el documento en una descripción global del producto. No redefine Product Vision, arquitectura de dominio global ni políticas operativas pertenecientes a otros directorios.

## 3. Architectural Context

Sitúa el tema dentro de la arquitectura por capas y explica qué dependencias son entrantes y salientes.

```text
Host / Consumer
        │
        ▼
Application Contract
        │
        ▼
Reglas de dependencias
        │
        ▼
Ports / Adapters / Infrastructure
```

El flujo conserva inversión de dependencias: las capas exteriores conocen contratos internos estables; el dominio no conoce frameworks, protocolos ni drivers.

## 4. Responsibilities

- Mantener una única semántica para el concepto documentado.
- Validar entradas en el límite apropiado y preservar invariantes en el núcleo.
- Exponer contratos tipados, explícitos y evolucionables.
- Emitir errores clasificables y observables sin filtrar detalles sensibles.
- Proporcionar pruebas que demuestren comportamiento normal, fallos y compatibilidad.
- Mantener trazabilidad entre documentación, código, pruebas y decisiones arquitectónicas.

## 5. Non-Responsibilities

- No decidir presentación visual ni comportamiento específico de UI.
- No acceder directamente a almacenamiento desde consumidores exteriores.
- No introducir dependencias inversas para reutilizar una implementación concreta.
- No convertir eventos en comandos ni consultas en mutaciones ocultas.
- No definir políticas de producto que pertenezcan a `00-Architecture` o requisitos.

## 6. Conceptual Model

Las dependencias prohibidas se validan por análisis estático y revisión de package manifests. Los conceptos deben identificarse mediante nombres estables, datos inmutables cuando representan hechos y versiones explícitas cuando forman parte de un contrato persistente. La identidad lógica se mantiene separada de hashes, ubicaciones físicas y representaciones de transporte.

## 7. Design and Components

Describe los componentes lógicos, su colaboración y los límites de sustitución.

1. **Contract boundary:** tipos y operaciones visibles para consumidores.
2. **Application coordinator:** ordena validación, autorización, ejecución y resultado.
3. **Domain policy:** mantiene invariantes independientes de infraestructura.
4. **Port:** contrato para capacidades externas.
5. **Adapter:** implementación sustituible de un port.
6. **Verification layer:** pruebas, métricas y reglas arquitectónicas.

- Las dependencias prohibidas se validan por análisis estático y revisión de package manifests.


## 8. Contracts and APIs

Los contratos públicos usan datos serializables y no exponen clases de drivers, handles de red ni objetos de framework. Los campos obligatorios no cambian de significado. Las extensiones compatibles se agregan de forma opcional o mediante nuevas versiones. Los contratos internos pueden evolucionar con mayor rapidez, pero deben respetar la dirección de dependencias y permanecer cubiertos por pruebas del paquete propietario.

## 9. Runtime Flow

1. El host recibe una solicitud y construye un contexto autenticado.
2. El boundary valida forma, tamaño, versión y permisos.
3. El coordinador selecciona el caso de uso o handler.
4. El núcleo comprueba invariantes y produce una decisión determinista.
5. Los ports ejecutan efectos externos dentro del presupuesto de tiempo.
6. El resultado y los eventos se confirman de acuerdo con la política transaccional.
7. El adaptador traduce la respuesta al protocolo del consumidor.
8. Observabilidad registra correlación, duración y resultado sin exponer datos sensibles.

## 10. Persistence and State

El estado autoritativo pertenece al subsistema que define la entidad. Las cachés son derivadas y reconstruibles. Toda persistencia debe indicar clave de identidad, versión, ownership, timestamps y política de borrado. Los cambios que deban coordinar datos y eventos utilizan transacción y outbox o un mecanismo equivalente. Las migraciones preservan datos y permiten despliegue progresivo.

## 11. Errors and Recovery

Los fallos se clasifican en validación, autorización, conflicto, no encontrado, dependencia temporal, corrupción e interno. Solo los fallos transitorios son reintentables. Cada reintento requiere idempotency key o una operación naturalmente idempotente. La recuperación evita confirmar cursores, eventos o estados derivados antes que el estado autoritativo. Los errores internos conservan causa para observabilidad y entregan una respuesta sanitizada al consumidor.

## 12. Security and Privacy

La identidad del propietario proviene del contexto autenticado. Los payloads no pueden sobrescribirla. Se aplica mínimo privilegio, validación de límites, protección contra inyección, secretos fuera de logs y reducción de datos enviados a proveedores externos. Las pruebas incluyen aislamiento entre propietarios y rechazo de operaciones sin scope.

## 13. Performance and Scalability

Las optimizaciones se justifican con mediciones. Se controlan cardinalidad, tamaño de payload, número de llamadas externas, memoria, latencia p50/p95/p99 y presión de colas. La paginación es estable, los límites son obligatorios y el backpressure evita trabajo ilimitado. Las cachés declaran clave, TTL, invalidación y consistencia esperada.

## 14. Testing and Verification

- Pruebas unitarias para políticas deterministas.
- Pruebas contractuales para cada implementación de port.
- Pruebas de integración con SQLite, PostgreSQL, filesystem o transporte real cuando corresponda.
- Pruebas de arquitectura para dependencias prohibidas.
- Pruebas de concurrencia, idempotencia y recuperación en flujos con escritura.
- Pruebas de seguridad para owner isolation y scopes.
- Validación de documentación sin placeholders y con referencias existentes.

## 15. Traceability

**Primary implementation packages**

- `packages/contracts`
- `packages/domain-types`
- `packages/kernel`

**Related architecture**

- `02-CodeArchitecture/README.md`
- `02-CodeArchitecture/00-Governance/`
- `00-Architecture/` cuando exista una decisión transversal relacionada.
- Manifests y pruebas de los paquetes indicados arriba.

## 16. Evolution Rules

Los cambios incompatibles requieren nueva versión contractual, migración explícita y periodo de coexistencia cuando existan consumidores desplegados de forma independiente. No se modifica una semántica existente reutilizando el mismo nombre. Las decisiones que afecten más de un módulo deben documentarse mediante ADR antes de introducir código.

## 17. Consolidated Baseline

El contenido anterior se conserva aquí como evidencia histórica de la intención inicial. En caso de contradicción, las secciones normativas anteriores gobiernan esta versión documental.

> # Forbidden Dependencies
> **Project:** KnowledgeOS  
> **Section:** Code Architecture / Dependency Rules  
> **Document:** ForbiddenDependencies  
> **Version:** 5.0  
> **Status:** Release Candidate  
> **Author:** KnowledgeOS Team  
> ---
> Forbidden dependencies include UI → persistence, Domain → framework, Platform public API → provider SDK, plugin → private Engine code, Local Library → Master database, synchronization → acquisition, and generated types → application implementation. Architecture tests SHALL enforce these rules.
