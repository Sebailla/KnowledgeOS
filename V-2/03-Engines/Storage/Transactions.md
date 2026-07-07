# Transactions

Versión: 1.0
Estado: Draft

---

# Propósito

Garantizar la consistencia de las operaciones que modifican datos.

---

# Reglas

- Una transacción es atómica.
- Puede confirmarse (Commit).
- Puede revertirse (Rollback).
- Los cambios solo son visibles tras un Commit exitoso.

---

# Uso

Las transacciones se utilizarán únicamente cuando una operación afecte múltiples objetos persistentes.

---

# Principio Fundamental

La integridad de los datos tiene prioridad sobre el rendimiento.
