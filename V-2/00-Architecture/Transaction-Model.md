# Transaction Model

Versión: 0.1
Estado: Working Draft

---

# 1. Propósito

El Transaction Model garantiza que toda modificación del conocimiento se
realice de forma consistente, atómica y recuperable.

Toda operación que altere el estado del sistema deberá ejecutarse dentro
de una transacción.

---

# 2. Principios

TM-001

Toda transacción es atómica.

---

TM-002

Una transacción finaliza únicamente mediante Commit o Rollback.

---

TM-003

Ningún cambio parcial podrá hacerse visible.

---

TM-004

Toda transacción posee identidad.

---

TM-005

Toda transacción registra auditoría.

---

TM-006

Las transacciones podrán anidarse únicamente cuando la implementación lo
permita explícitamente.

---

# 3. Ciclo de Vida

Inicio

↓

Validación

↓

Ejecución

↓

Commit

↓

Eventos

o

Rollback

---

# 4. Participantes

Una transacción puede involucrar:

Object Manager

Relation Manager

Document Manager

Annotation Manager

Resource Manager

Version Manager

Repositories

---

# 5. Garantías

Consistencia.

Atomicidad.

Durabilidad.

Recuperación.

Trazabilidad.

---

# 6. Eventos

Una transacción podrá emitir:

TransactionStarted

TransactionCommitted

TransactionRollback

TransactionFailed

---

# 7. Principio Fundamental

El conocimiento nunca podrá quedar parcialmente actualizado.
