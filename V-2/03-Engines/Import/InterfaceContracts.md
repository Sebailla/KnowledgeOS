
# Interface Contracts

## ImportEngine

### Import()

**Entrada**

DocumentSource

**Salida**

ImportedDocument

---

### Validate()

Entrada:

UDM

Salida:

ValidationResult

---

### SupportedFormats()

Salida:

Collection<Format></format>

---

## Parser

Todo Parser implementa:

- Supports()
- Parse()
- Validate()

Nunca persiste información.
