# Storage

Version: 1.0

Status: Draft

---

# Objetivo

Definir la arquitectura física del almacenamiento de KnowledgeOS.

---

# Arquitectura

Storage

├── Library
├── Assets
├── Database
├── Indexes
├── Cache
├── Journal
├── Backups
└── Configuration

---

# Componentes

## Library

Almacena únicamente documentos UDM.

Nunca contiene recursos binarios.

---

## Assets

Almacena recursos binarios compartidos.

Ejemplos:

- imágenes
- audio
- vídeo
- modelos 3D
- datasets
- adjuntos

---

## Database

Almacena exclusivamente información operacional.

Nunca almacena el contenido de los documentos.

---

## Indexes

Almacena índices reconstruibles.

---

## Cache

Almacena información regenerable.

Puede eliminarse completamente.

---

## Journal

Registra todas las operaciones persistentes.

Permite recuperación ante fallos.

---

## Backups

Almacena snapshots completos de la biblioteca.

---

## Configuration

Preferencias y configuración del sistema.

---

# Reglas

1. El contenido del documento vive únicamente en Library.
2. Los recursos binarios viven únicamente en Assets.
3. Los índices pueden reconstruirse.
4. La caché puede eliminarse.
5. El Journal nunca se modifica.
6. Todo cambio genera una entrada en el Journal.
7. Todo recurso posee checksum.
8. Toda operación es transaccional.
