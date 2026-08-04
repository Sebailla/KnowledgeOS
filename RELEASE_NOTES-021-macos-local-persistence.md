# Sprint 021 — macOS Local Persistence

## Directorio de instalación

Descomprimir en la raíz de `KnowledgeOS/`.

## Cambios

- Persistencia JSON local, versionada y determinista.
- Escritura atómica mediante archivo temporal y reemplazo.
- Backup automático antes de cada reemplazo.
- Recuperación automática desde backup si el archivo principal está corrupto.
- Persistencia de posiciones de lectura.
- Persistencia de anotaciones y bookmarks.
- Endpoints `persistence.health`, `persistence.backup` y `persistence.restore`.
- DTOs y métodos Swift para estado, respaldo y restauración.
- Estado de persistencia integrado en Settings de macOS.
- Se preserva íntegramente el árbol Apple existente.
