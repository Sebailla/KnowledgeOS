
# Interface Contracts

Versión: 1.0
Estado: Draft

---

## AIService

### Responsabilidades

- ExecuteTask()
- CancelTask()
- GetTaskStatus()

---

## ContextBuilder

### Responsabilidades

- BuildContext()
- ValidateContext()

---

## AIProvider

### Responsabilidades

- Execute()
- HealthCheck()
- GetCapabilities()

---

## ResponseValidator

### Responsabilidades

- Validate()
- Normalize()
