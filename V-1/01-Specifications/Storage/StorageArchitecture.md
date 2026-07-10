
# Storage Architecture

Version: 1.0

---

KnowledgeOS

├── Library
│   └── *.kdoc
│
├── Assets
│
├── Database
│
├── Indexes
│
├── Cache
│
├── Journal
│
├── Backups
│
└── Config

---

# Principios

El contenido vive en .kdoc.

Los Assets viven fuera.

La Database contiene únicamente información operacional.

Los índices pueden reconstruirse.

La Cache puede eliminarse.

Todo cambio queda registrado en Journal.
