
# Asset Storage

Version: 1.0

---

# Objetivo

Definir el almacenamiento de recursos binarios.

---

# Organización

Assets/

↓

SHA256/

↓

aa/

↓

bb/

↓

aabbccddeeff...

---

# Reglas

Todo Asset posee:

AssetID

Checksum

Mime

Size

Width

Height

Duration

StoragePath

---

# Deduplicación

Dos Assets con el mismo SHA-256 representan exactamente el mismo recurso.

Nunca se almacenan dos veces.
