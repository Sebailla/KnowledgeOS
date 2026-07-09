
# C4 Level 1 - System Context

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Describir el contexto del sistema, sus actores y los sistemas externos con los que interactúa.

Este documento se corresponde con el nivel 1 del modelo C4.

---

# Sistema

KnowledgeOS es una plataforma de gestión de conocimiento personal que permite importar, organizar, enriquecer, buscar, anotar y consultar documentos mediante un modelo unificado de conocimiento (UDM).

---

# Actores

## Usuario

Persona que utiliza KnowledgeOS para gestionar su biblioteca de conocimiento.

Responsabilidades:

- importar documentos
- organizar bibliotecas
- leer documentos
- crear anotaciones
- realizar búsquedas
- consultar IA
- sincronizar dispositivos
- exportar contenido

---

# Sistemas externos

## Sistema de Archivos

Proporciona acceso a documentos originales.

KnowledgeOS nunca modifica estos archivos.

---

## NAS

Source of Truth de la biblioteca.

Almacena la información persistente de KnowledgeOS.

---

## Servicios de IA

Proveedores opcionales de modelos de inteligencia artificial.

Su ausencia no afecta el funcionamiento esencial del sistema.

---

## Modelos Locales

Modelos ejecutados en el dispositivo del usuario.

Son equivalentes funcionalmente a los servicios remotos.

---

## Proveedores OCR

Servicios o motores utilizados para reconocer texto en documentos escaneados.

Opcionales.

---

## Sistemas de Exportación

Destinos externos para generar documentos derivados.

Ejemplos:

- Markdown
- PDF
- HTML
- EPUB

---

# Relaciones

Usuario

↓

KnowledgeOS

↓

Library

↓

NAS

---

KnowledgeOS

↓

Sistema de Archivos

(solo lectura)

---

KnowledgeOS

↓

Servicios IA

(opcional)

---

KnowledgeOS

↓

Modelos Locales

(opcional)

---

KnowledgeOS

↓

OCR

(opcional)

---

KnowledgeOS

↓

Exportadores

---

# Límites

Dentro del sistema:

- Core
- Engines
- UDM
- Biblioteca
- Plugins

Fuera del sistema:

- documentos originales
- NAS
- modelos IA
- OCR
- sistemas de exportación

---

# Responsabilidades del sistema

- importar conocimiento
- preservar documentos originales
- construir el UDM
- mantener la biblioteca
- indexar conocimiento
- renderizar contenido
- gestionar anotaciones
- sincronizar bibliotecas
- integrar IA
- exportar conocimiento

---

# Decisiones Congeladas

1. KnowledgeOS constituye un único sistema.
2. El usuario interactúa exclusivamente con KnowledgeOS.
3. Los documentos originales permanecen fuera del sistema.
4. El NAS es la Source of Truth.
5. La IA es un sistema externo opcional.
6. OCR es un servicio externo.
7. Los exportadores representan integraciones externas.
