# Storage Engine

Versión: 1.0
Estado: Draft

---

# Propósito

El Storage Engine proporciona servicios de persistencia para toda la plataforma.

Es el único Engine autorizado para acceder al almacenamiento físico.

---

# Responsabilidades

- Persistencia.
- Lectura.
- Escritura.
- Versionado.
- Migraciones.
- Backups.

---

# No es responsable de

- interpretar documentos;
- indexar contenido;
- renderizar información;
- aplicar lógica de negocio.

---

# Componentes

- Overview.md
- DataModel.md
- Repositories.md
- Transactions.md
- Backup.md
- Migration.md

---

# Principio Fundamental

Todo dato persistente pasa por el Storage Engine.
