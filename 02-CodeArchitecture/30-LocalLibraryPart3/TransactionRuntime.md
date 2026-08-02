# TransactionRuntime

**Project:** KnowledgeOS  
**Section:** Code Architecture / 30-LocalLibraryPart3  
**Document:** TransactionRuntime  
**Version:** 5.6.2  
**Status:** Consolidated  
**Implemented by:** `packages/local-library-runtime`  
**Last updated:** 2026-08-02

---
## 1. Propósito

Este documento desarrolla **unidad de trabajo, concurrencia, commit, rollback lógico y eventos derivados** dentro de composición productiva de biblioteca local. No redefine la visión del producto ni sustituye los ADR; traduce esas decisiones a reglas implementables y verificables para coordina caché, mantenimiento, runtime Node SQLite, recuperación y compatibilidad de plataforma.

El objetivo es que cualquier cambio relacionado con **TransactionRuntime** pueda evaluarse sin depender de conocimiento tácito. La especificación establece qué debe permanecer estable, qué puede evolucionar detrás de contratos y qué evidencia deben aportar las pruebas.

## 2. Alcance

Incluye los contratos, estados, validaciones, interacciones y responsabilidades directamente asociados con TransactionRuntime. Comprende ejecución local y de servidor cuando corresponda, persistencia durable, observabilidad y comportamiento frente a reintentos.

Quedan fuera la experiencia visual del usuario, decisiones de producto ajenas al módulo y detalles internos de proveedores que no atraviesen la interfaz pública.

## 3. Contexto arquitectónico

Composición productiva de biblioteca local se ubica entre los contratos de dominio y los adaptadores operativos. Sus consumidores no deben depender de tablas, rutas físicas ni implementaciones concretas. La dirección de dependencia es desde adaptadores hacia contratos estables.

**Dependencias permitidas:** contratos compartidos, puertos explícitos, tipos de valor inmutables y servicios de plataforma aprobados.

**Dependencias prohibidas:** acceso lateral a bases de datos de otros módulos, uso directo de detalles del NAS, acoplamiento a HTTP desde el dominio y decisiones basadas en estado global mutable.

## 4. Responsabilidades

Para TransactionRuntime, el módulo debe:

1. validar entradas antes de producir efectos;
2. preservar identidad, orden y versiones;
3. hacer idempotentes las operaciones reintentables;
4. separar planificación de ejecución;
5. registrar resultados y fallos con contexto suficiente;
6. mantener aislamiento por propietario o biblioteca;
7. exponer resultados deterministas para la misma entrada y estado;
8. impedir que un fallo parcial se presente como éxito.

## 5. No responsabilidades

El módulo no decide políticas de interfaz, no interpreta credenciales sin un contexto autenticado, no modifica almacenamiento ajeno por acceso directo y no utiliza la documentación como sustituto de validaciones en runtime. Tampoco garantiza disponibilidad de proveedores externos: debe representar degradación, timeout y cancelación de forma explícita.

## 6. Modelo conceptual e invariantes

Los conceptos centrales son identidad estable, versión monotónica, estado observable, operación idempotente y procedencia. En TransactionRuntime, toda entidad durable debe poder rastrearse hasta una entrada o evento causal.

**Invariantes:**

- una identidad no cambia durante el ciclo de vida;
- una versión nunca retrocede;
- una transición inválida no produce efectos parciales visibles;
- un hash o fingerprint siempre describe bytes canónicos;
- los cursores y secuencias avanzan únicamente después de confirmación;
- el borrado lógico y el físico son operaciones distintas;
- los límites de tamaño, tiempo y concurrencia se validan antes de reservar recursos significativos.

## 7. Componentes y contratos

La implementación reside principalmente en `packages/local-library-runtime`. La separación recomendada distingue: contratos y modelos; servicio de aplicación; puertos de repositorio o transporte; adaptadores de infraestructura; composición productiva; y pruebas de integración.

Los contratos públicos deben usar tipos serializables y evitar exponer clientes SQL, streams específicos de Node o errores de proveedor. Los contratos internos pueden ser más especializados, pero deben conservar cancelación, deadlines y contexto de trazabilidad.

## 8. Flujo de procesamiento

El flujo normativo para TransactionRuntime es:

1. recibir una solicitud con identidad y contexto;
2. normalizar y validar;
3. cargar solo el estado necesario;
4. comprobar precondiciones, versión y permisos;
5. construir un plan sin efectos;
6. ejecutar mediante puertos;
7. verificar el resultado;
8. persistir estado y evento/outbox cuando corresponda;
9. publicar métricas y devolver una respuesta estable.

La cancelación se comprueba antes de cada fase costosa. Un reintento debe detectar trabajo ya confirmado y devolver el resultado previo o continuar desde un checkpoint válido.

## 9. Persistencia y concurrencia

La persistencia asociada a TransactionRuntime debe utilizar constraints como última línea de defensa. Las transacciones abarcan únicamente recursos que puedan confirmarse atómicamente; cuando intervienen filesystem y base de datos, se usa staging más registro durable, outbox o compensación.

La concurrencia se controla mediante versiones esperadas, claves únicas, leases con expiración o locks acotados. Nunca se mantiene una transacción SQL abierta mientras se transmite un archivo completo o se espera una llamada remota.

## 10. Errores, recuperación y observabilidad

Los errores se clasifican como validación, conflicto, no encontrado, integridad, indisponibilidad, timeout, cancelación y fallo interno. Cada categoría tiene semántica estable y no filtra secretos ni SQL.

La recuperación parte de evidencia durable: staging, journal, checkpoint, lease o estado de sesión. Las métricas mínimas incluyen duración, bytes, elementos procesados, reintentos, conflictos y resultado. Los logs incorporan correlation ID, owner/library ID anonimizado, operación y fase, evitando contenido documental sensible.

## 11. Seguridad y privacidad

Toda operación se ejecuta con identidad autenticada suministrada por el host. IDs recibidos en payload no reemplazan al propietario autenticado. Las rutas se normalizan y se confinan al root permitido; los nombres originales son metadatos, no rutas de almacenamiento. Los hashes no se consideran secretos, pero tampoco deben convertirse en un canal para enumerar contenido ajeno. Los límites protegen contra agotamiento de memoria, disco, conexiones y workers.

## 12. Rendimiento y escalabilidad

El diseño favorece procesamiento incremental, streaming y lotes acotados. Las consultas frecuentes requieren índices alineados con owner, estado, secuencia, identidad y timestamps. Los límites deben ser configurables con valores seguros. La escalabilidad horizontal exige que coordinación y progreso sean durables; una memoria local puede optimizar, pero nunca ser la única fuente de verdad.

## 13. Estrategia de pruebas

Las pruebas de TransactionRuntime incluyen:

- unitarias para validación y transiciones;
- contract tests para puertos y adaptadores;
- integración con PostgreSQL, SQLite o filesystem real cuando aplique;
- propiedades de idempotencia y monotonicidad;
- inyección de fallos entre fases;
- concurrencia sobre la misma identidad;
- recuperación después de reinicio;
- límites de tamaño, rangos y backpressure;
- compatibilidad de migraciones.

Una prueba que solo verifica el camino feliz no constituye evidencia suficiente para aprobar cambios en este módulo.

## 14. Evolución y compatibilidad

Las ampliaciones deben agregarse detrás de contratos versionados o capacidades opcionales. Los cambios de esquema se realizan con migraciones forward-compatible y, cuando sea necesario, fases expand/migrate/contract. Los consumidores antiguos deben fallar explícitamente ante capacidades no soportadas, nunca interpretar silenciosamente datos con otra semántica.

## 15. Trazabilidad

**Implementación principal:** `packages/local-library-runtime`.

**Documentación rectora:** `02-CodeArchitecture/30-LocalLibraryPart3/ModuleSpecification.md`.

**Evidencia esperada:** pruebas del paquete, pruebas de integración del adaptador, validación de migraciones y escenarios de recuperación.

**Relaciones:** Foundation y Kernel definen reglas transversales; Master Library, Storage, Sync o Local Library consumen este módulo según la dirección de dependencia documentada.

---

## Apéndice A — Contenido histórico preservado

# Transaction Runtime

`NodeSqliteDatabase.run` creates an immediate transaction.

Nested calls use savepoints. A failure rolls back only the active transactional scope while the outer transaction retains control.
