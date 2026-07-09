
# C4 Level 1 – System Context

**Proyecto:** KnowledgeOS

**Versión:** 1.0

**Estado:** Congelado

---

# Objetivo

Mostrar el sistema completo, sus usuarios y los sistemas externos con los que interactúa.

Este nivel no describe la arquitectura interna.

---

# Actor

## Usuario

Utiliza KnowledgeOS para:

- importar documentos
- organizar bibliotecas
- leer contenido
- crear anotaciones
- realizar búsquedas
- consultar IA
- sincronizar dispositivos
- exportar información

---

# Sistema

## KnowledgeOS

Plataforma de gestión de conocimiento personal basada en un Universal Document Model (UDM).

Responsabilidades:

- importar documentos
- preservar originales
- construir el UDM
- organizar bibliotecas
- indexar conocimiento
- renderizar documentos
- gestionar anotaciones
- sincronizar dispositivos
- integrar IA
- exportar contenido

---

# Sistemas externos

## Sistema de archivos

Ubicación de los documentos originales.

KnowledgeOS únicamente los lee.

---

## NAS

Source of Truth de la biblioteca.

Almacena toda la información persistente.

---

## Servicios de IA

Modelos remotos utilizados opcionalmente.

---

## Modelos Locales

LLMs ejecutados en el dispositivo.

---

## OCR

Motores utilizados para documentos escaneados.

---

## Exportadores

Generan:

- Markdown
- HTML
- PDF
- EPUB

---

# Decisiones congeladas

1. KnowledgeOS es un único sistema.
2. Los documentos originales permanecen fuera del sistema.
3. El NAS es la Source of Truth.
4. La IA es opcional.
5. OCR es opcional.
6. Los exportadores son sistemas externos.
