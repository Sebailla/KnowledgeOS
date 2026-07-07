
# Interface Contracts

Versión: 1.0
Estado: Draft

---

## SyncService

### Responsabilidades

- StartSync()
- CancelSync()
- RetrySync()
- GetStatus()

---

## ChangeDetector

### Responsabilidades

- DetectChanges()
- CreateChangeSet()

---

## ConflictResolver

### Responsabilidades

- DetectConflicts()
- ResolveConflict()
- ValidateResolution()

---

## SyncAdapter

### Responsabilidades

- Connect()
- Pull()
- Push()
- Disconnect()
