
# 05 — UDM Builder Stage

Parte del Universal Import Pipeline

---

# 1. Propósito

La etapa UDM Builder tiene como objetivo transformar:

- RawDocumentModel (RDM)
- StructuredDocumentModel (SDM)
- LayoutDocumentModel (LDM)

en un modelo unificado de conocimiento:

> Universal Document Model (UDM)

El UDM representa el documento como conocimiento navegable,
relacionable y anotable.

---

# 2. Entrada

La entrada es:

- RDM (contenido bruto)
- SDM (estructura lógica)
- LDM (layout visual)

---

# 3. Salida

La salida es un **UDM Graph**.

El UDM no es un documento lineal.

Es un grafo de conocimiento interno.

---

# 4. Universal Document Model (UDM)

El UDM está compuesto por:

## 4.1 Objects (Objetos)

Un Objeto representa una unidad semántica mínima.

Ejemplos:

- párrafo
- título
- imagen
- tabla
- figura
- ecuación
- cita
- bloque de código

Cada objeto posee:

- ID único
- tipo
- contenido
- metadatos
- origen (RDM reference)
- posición en SDM
- representación en LDM

---

## 4.2 Relationships (Relaciones)

Las relaciones conectan objetos.

Ejemplos:

- “pertenece a sección”
- “sigue a”
- “refiere a”
- “explica”
- “contradice”
- “ilustra”
- “depende de”

Las relaciones son parte del conocimiento.

---

## 4.3 Annotations (preparación)

El UDM deja puntos de anclaje para anotaciones futuras.

- highlights
- comentarios
- referencias cruzadas
- marcadores

---

## 4.4 Provenance links

Cada objeto mantiene trazabilidad:

- RDM source block
- SDM section
- LDM layout region

---

# 5. Construcción del UDM

El UDM Builder realiza:

---

## 5.1 Object creation

Cada unidad del SDM se transforma en uno o más objetos.

Ejemplo:

- párrafo → Object(P)
- imagen → Object(I)
- tabla → Object(T)

---

## 5.2 Relation inference

Se crean relaciones a partir de:

- jerarquía SDM
- orden de lectura
- proximidad visual (LDM)
- referencias explícitas

---

## 5.3 Cross-layer fusion

Se fusionan señales de:

- contenido (RDM)
- estructura (SDM)
- layout (LDM)

para enriquecer los objetos.

---

## 5.4 Semantic clustering (básico)

Se agrupan objetos en unidades mayores:

- secciones
- capítulos
- bloques conceptuales

---

# 6. Reglas

## R-001

El UDM no pierde información de entrada.

---

## R-002

El UDM no elimina objetos.

Solo los organiza.

---

## R-003

Toda relación debe tener justificación en al menos una capa (RDM, SDM o LDM).

---

## R-004

El UDM es independiente del formato original.

---

## R-005

El UDM es la única fuente válida para capas superiores del sistema.

---

# 7. Ejemplo de UDM

```text
Objects:

P1: Paragraph
  content: "Introduction..."
  source: RDM-T1

I1: Image
  type: Figure
  source: RDM-I1

T1: Table
  source: RDM-TB1

Relations:

P1 → belongs_to → Section 1
P1 → precedes → P2
I1 → illustrates → P3
T1 → supports → P4
```

---

# 8. Propiedades del UDM

- navegable
- consultable
- anotable
- versionable
- trazable
- independiente del formato

---

# 9. Diferencia con etapas anteriores

| Nivel | Función                        |
| ----- | ------------------------------- |
| RDM   | qué existe                     |
| SDM   | cómo está organizado          |
| LDM   | cómo se ve                     |
| UDM   | qué significa estructuralmente |

---

# 10. Objetivo de diseño

El UDM es la primera representación del documento como conocimiento real.

---

# 11. Principio fundamental

El UDM es el único modelo que será utilizado por el resto del sistema
para interactuar con el conocimiento.
