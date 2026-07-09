
# Sequence – Load Plugin

## Objetivo

Describir el ciclo de carga e inicialización de un plugin.

---

## Participantes

- Usuario
- UI
- Plugin Engine
- Plugin
- Event Bus

---

## Flujo principal

1. El usuario instala un plugin.
2. La UI solicita la instalación.
3. El Plugin Engine valida el paquete.
4. Registra el plugin.
5. Inicializa el plugin.
6. Publica `PluginLoaded`.
7. La UI actualiza el listado de plugins.

---

## Flujos alternativos

### Plugin incompatible

La instalación se cancela.

### Error durante la inicialización

El plugin se desactiva automáticamente.

---

## Resultado

El plugin queda disponible para ser utilizado.
