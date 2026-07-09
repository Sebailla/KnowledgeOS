
# C4 Level 2 – Container Diagram

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Describir los principales contenedores que conforman KnowledgeOS y las relaciones entre ellos.

En este nivel no se describen componentes internos (Engines), únicamente aplicaciones, servicios y almacenamiento.

---

# Contenedores

## macOS App

Aplicación principal de KnowledgeOS.

Responsabilidades:

- Gestión de la biblioteca
- Lectura
- Edición
- Anotaciones
- Búsqueda
- IA
- Sincronización

---

## iPad App

Cliente optimizado para lectura y anotaciones con Apple Pencil.

---

## iPhone App

Cliente optimizado para consulta rápida de la biblioteca.

---

## Web App (Opcional)

Cliente ligero para consulta y colaboración futura.

No reemplaza a la aplicación de escritorio.

---

## Knowledge Core

Núcleo funcional compartido por todos los clientes.

Responsabilidades:

- Orquestación
- UDM
- Reglas de negocio
- Eventos
- Casos de uso

Los Engines internos se documentan en los diagramas C4 Nivel 3.

---

## Local Storage

Persistencia local.

Contiene:

- Biblioteca local
- Metadata
- Índices
- Caché
- Estado offline

No constituye la Source of Truth.

---

## Sync Service

Gestiona la sincronización entre el almacenamiento local y el NAS.

---

## AI Gateway

Punto único de acceso a modelos de IA locales y remotos.

No implementa modelos propios.

---

## Plugin Host

Infraestructura para extensiones del sistema.

---

# Sistemas Externos

## NAS

Source of Truth de la biblioteca.

---

## Sistema de Archivos

Ubicación de los documentos originales.

KnowledgeOS únicamente los lee.

---

## Servicios IA

Modelos remotos.

---

## Modelos Locales

LLMs ejecutados en el dispositivo.

---

## OCR

Servicio opcional.

---

# Relaciones

- Todos los clientes utilizan el Knowledge Core.
- Knowledge Core utiliza Local Storage.
- Knowledge Core utiliza Sync Service.
- Knowledge Core utiliza AI Gateway.
- Knowledge Core utiliza Plugin Host.
- Sync Service sincroniza con el NAS.
- AI Gateway consume modelos locales y remotos.
- Knowledge Core lee documentos originales desde el Sistema de Archivos.

---

# Decisiones Congeladas

1. Todos los clientes comparten el mismo Core.
2. Existe un único Knowledge Core.
3. Los Engines no aparecen en Nivel 2.
4. El NAS es la Source of Truth.
5. Local Storage representa únicamente persistencia local.
6. AI Gateway abstrae todos los proveedores de IA.
7. Plugin Host constituye el único mecanismo de extensibilidad.
