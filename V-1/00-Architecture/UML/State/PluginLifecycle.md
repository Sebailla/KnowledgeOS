
# State – Plugin Lifecycle

## Objetivo

Describir el ciclo de vida de un plugin administrado por el Plugin Engine.

---

## Estados

- Discovered
- Registered
- Installed
- Loaded
- Running
- Disabled
- Unloaded
- Removed

---

## Transiciones

Discovered → Registered

Registered → Installed

Installed → Loaded

Loaded → Running

Running → Disabled

Disabled → Running

Running → Unloaded

Unloaded → Removed

---

## Estado Inicial

Discovered

---

## Estado Final

Removed
