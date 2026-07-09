# ADR-008 - Storage Architecture

**Estado:** Accepted

---

# Contexto

KnowledgeOS administra una biblioteca de conocimiento compuesta por documentos, modelos derivados, anotaciones, índices, recursos y metadatos.

El almacenamiento debe garantizar:

- funcionamiento offline;
- independencia tecnológica;
- integridad de la información;
- escalabilidad;
- sincronización futura.

La arquitectura no debe depender de un motor de persistencia específico.

---

# Decisión

La persistencia se divide en dominios independientes.

Cada dominio administra exclusivamente su propio tipo de información.

El acceso al almacenamiento se realiza únicamente mediante contratos definidos por el Library Engine.

Ningún Engine puede acceder directamente al mecanismo de almacenamiento.

---

# Dominios de almacenamiento

## Original Documents

Archivos importados.

Características:

- Solo lectura.
- Nunca modificados.
- Permanecen en la Source of Truth.

---

## UDM Store

Representación canónica del conocimiento.

Contiene exclusivamente el Universal Document Model.

---

## Annotation Store

Contiene:

- highlights
- ink
- bookmarks
- sticky notes
- text notes

Nunca modifica el UDM.

---

## Layout Store

Contiene:

- geometría
- columnas
- flujo visual
- reconstrucción

Es regenerable.

---

## Asset Store

Contiene recursos asociados.

Ejemplos:

- imágenes
- miniaturas
- OCR
- audio
- vídeo

---

## Search Index

Contiene índices derivados.

Puede reconstruirse completamente.

---

## Metadata Store

Contiene:

- UUID
- hash
- fechas
- etiquetas
- colecciones
- estadísticas

---

## Cache

Almacena información temporal.

Puede eliminarse completamente.

---

# Clasificación de persistencia

Persistencia permanente

- Original Documents
- UDM
- Annotation
- Metadata

Persistencia regenerable

- Layout
- Search Index
- Cache

---

# Responsabilidades

Library Engine

- administra persistencia

UDM Engine

- administra únicamente el modelo lógico

Los demás Engines utilizan contratos públicos.

---

# Consecuencias

## Positivas

- Bajo acoplamiento.
- Escalabilidad.
- Regeneración de índices.
- Sustitución del almacenamiento.
- Mejor sincronización.

## Negativas

- Mayor número de repositorios.
- Mayor coordinación entre dominios.

---

# Alternativas consideradas

Una única base de datos.

Descartada por mezclar responsabilidades.

Persistencia distribuida por Engine.

Descartada por dificultar consistencia.

---

# Decisiones congeladas

1. La persistencia pertenece exclusivamente al Library Engine.
2. El almacenamiento se divide por dominios.
3. El UDM es persistente.
4. Las anotaciones son persistentes.
5. Los índices son regenerables.
6. El Layout es regenerable.
7. La caché nunca contiene información única.
8. El almacenamiento es independiente de la tecnología utilizada.