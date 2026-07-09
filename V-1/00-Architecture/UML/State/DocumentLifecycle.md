# State – Document Lifecycle

## Objetivo

Describir el ciclo de vida de un documento desde su incorporación a la biblioteca hasta su eliminación.

---

## Estados

- Imported
- Processing
- Indexed
- Available
- Modified
- Synchronizing
- Synchronized
- Archived
- Deleted

---

## Transiciones

Imported → Processing

Processing → Indexed

Indexed → Available

Available → Modified

Modified → Synchronizing

Synchronizing → Synchronized

Synchronized → Available

Available → Archived

Archived → Available

Available → Deleted

Archived → Deleted

---

## Estado Inicial

Imported

---

## Estado Final

Deleted
