# UDM Serialization

Version: 1.0

Status: Draft

---

# Objetivo

Definir cómo persistir el Universal Document Model.

---

# Formatos

JSON

SQLite

Binary

---

# JSON

Formato legible.

Utilizado para:

debug

tests

plugins

---

# SQLite

Formato principal.

Utilizado por:

Library

Search

Sync

---

# Binary

Optimizado para transferencia.

Utilizado por:

Cache

Sync

Mobile

---

# Compatibilidad

Toda serialización debe producir exactamente el mismo árbol.
