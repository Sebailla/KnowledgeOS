# Knowledge Architecture

Version: 1.0

Status: Draft

---

# Objetivo

Definir la arquitectura completa del conocimiento dentro de KnowledgeOS.

KnowledgeOS almacena conocimiento utilizando dos modelos complementarios:

- Universal Document Model (UDM)
- Knowledge Graph (KG)

Ambos modelos representan el mismo conocimiento desde perspectivas diferentes.

---

# Universal Document Model

El UDM representa el documento.

Características

- Jerárquico
- Ordenado
- Inmutable
- Determinístico

Responsabilidad

Representar exactamente el contenido del documento.

---

# Knowledge Graph

El Knowledge Graph representa el conocimiento.

Características

- Grafo dirigido
- No jerárquico
- Evolutivo
- Semántico

Responsabilidad

Relacionar información entre documentos.

---

# Relación

Todo documento UDM puede generar información para el Knowledge Graph.

Nunca ocurre el proceso inverso.

UDM -----> Knowledge Graph

---

# Fuente de verdad

El UDM siempre es la fuente de verdad.

El Knowledge Graph puede regenerarse completamente.

---

# Sincronización

Cuando cambia un documento:

1. cambia el UDM
2. se publica DocumentUpdated
3. se reconstruye parcialmente el Knowledge Graph

Nunca manualmente.

---

# IA

La IA nunca modifica el UDM.

La IA únicamente puede:

- crear embeddings
- crear entidades
- crear conceptos
- crear relaciones
- crear resúmenes
- crear clasificaciones

Todo ello pertenece al Knowledge Graph.

---

# Usuario

El usuario modifica:

- documento
- anotaciones

Nunca modifica directamente el grafo.

---

# Render

El Render Engine utiliza exclusivamente el UDM.

Nunca consulta el Knowledge Graph.

---

# Search

La búsqueda utiliza ambos.

UDM

Knowledge Graph

=

Resultados
