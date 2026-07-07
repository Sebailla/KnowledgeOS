
# Interface Contracts

Versión: 1.0
Estado: Draft

---

## Propósito

Define los contratos públicos del Storage Engine.

## Interfaces

### StorageService

Responsabilidades:

- Save()
- Update()
- Delete()
- Find()
- Exists()

---

### Repository

Responsabilidades:

- Insert()
- Update()
- Remove()
- Query()

---

### TransactionManager

Responsabilidades:

- Begin()
- Commit()
- Rollback()

---

### MigrationManager

Responsabilidades:

- CurrentVersion()
- PendingMigrations()
- Execute()
