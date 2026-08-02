# Module Specification

**Project:** KnowledgeOS  
**Section:** Code Architecture / 19-MasterStorage  
**Document:** Module Specification  
**Version:** 5.6.2  
**Status:** Consolidated  
**Implemented by:** `packages/master-storage`  
**Last updated:** 2026-08-02

---
## 1. Misión

Almacenamiento autoritativo de archivos existe para controla staging, commit, layout, integridad, recuperación y objetos huérfanos. Esta especificación gobierna sus documentos subordinados y la implementación ubicada en `packages/master-storage`.

## 2. Principios obligatorios

- offline-first cuando el componente se ejecute en cliente;
- NAS/Master Library como autoridad para datos compartidos;
- identidad estable separada de hash y ubicación;
- operaciones idempotentes y reanudables;
- persistencia durable antes de confirmar progreso;
- dependencias dirigidas hacia contratos;
- seguridad por contexto autenticado;
- observabilidad sin exposición de contenido sensible.

## 3. Límites

El módulo posee sus modelos y adaptadores. No posee la interfaz de usuario ni puede escribir directamente en persistencias de otros bounded contexts. Toda integración cruza contratos explícitos.

## 4. Arquitectura normativa

La arquitectura se divide en contratos, dominio, aplicación, puertos, adaptadores y composición. Los adaptadores pueden depender hacia adentro; el dominio no conoce PostgreSQL, SQLite, HTTP, filesystem ni Node.

## 5. Modelo de ejecución

Cada solicitud atraviesa validación, autorización, carga de estado, planificación, ejecución, verificación, persistencia y respuesta. Las fases costosas aceptan cancelación y límites. El progreso durable se representa mediante versiones, secuencias, checkpoints o sesiones según el módulo.

## 6. Persistencia e integridad

Las bases de datos imponen claves, unicidad y relaciones necesarias. El filesystem usa staging y rename atómico cuando la plataforma lo garantiza. Cuando no existe transacción distribuida, el workflow utiliza outbox, reconciliación o compensación.

## 7. Calidad

La aprobación requiere TypeScript estricto, pruebas unitarias y de integración, escenarios de fallo, documentación actualizada y ausencia de bypass hacia almacenamiento. Los objetivos de rendimiento se expresan como presupuestos medibles y no como afirmaciones generales.

## 8. Seguridad

El owner/library context proviene de autenticación. Se validan rutas, tamaños, rangos, MIME y checksums. Los logs excluyen bytes y contenido personal. Los secretos se inyectan por configuración segura.

## 9. Evolución

Los contratos públicos y esquemas persistentes evolucionan de forma compatible. Las capacidades nuevas se negocian explícitamente. Las migraciones son reejecutables y observables.

## 10. Mapa documental

Los documentos de esta carpeta especializan esta especificación. `README.md` ofrece el recorrido de lectura; los documentos temáticos profundizan protocolos, modelos, fallos y pruebas; `diagrams/` contiene representaciones PlantUML mantenibles.
