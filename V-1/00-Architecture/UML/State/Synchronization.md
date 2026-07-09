
# State – Synchronization

## Objetivo

Describir el ciclo de vida de una operación de sincronización.

---

## Estados

- Idle
- DetectingChanges
- Planning
- Synchronizing
- ResolvingConflicts
- Completed
- Failed

---

## Transiciones

Idle → DetectingChanges

DetectingChanges → Planning

Planning → Synchronizing

Synchronizing → Completed

Synchronizing → ResolvingConflicts

ResolvingConflicts → Synchronizing

Synchronizing → Failed

Failed → Planning

Completed → Idle

---

## Estado Inicial

Idle

---

## Estado Final

Idle
