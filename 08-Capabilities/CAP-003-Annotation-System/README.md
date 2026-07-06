
# CAP-003 — Annotation System

Versión: 0.1
Estado: Diseño

---

# 1. Propósito

El Annotation System permite al usuario:

- resaltar información
- escribir notas
- dibujar sobre el contenido
- crear comentarios estructurados
- conectar ideas dentro del Knowledge Graph

Las anotaciones no son decoración.

Son **objetos de conocimiento de primera clase**.

---

# 2. Principio fundamental

Toda anotación es un nodo dentro del UDM.

No existe anotación “visual pura”.

Toda anotación tiene significado estructural o semántico.

---

# 3. Tipos de anotaciones

---

## 3.1 Highlight

Resaltado de contenido.

Propiedades:

- color semántico (no solo visual)
- opacidad
- rango de objetos UDM
- persistencia

Ejemplo:

```text
Highlight:
  target: Object(P3)
  color: fluorescent-yellow
  intensity: 0.4
```

---

## 3.2 Freehand Ink

Dibujo a mano alzada.

Propiedades:

- trazos vectoriales
- soporte Apple Pencil
- capas independientes
- agrupación por gesto

---

## 3.3 Sticky Notes

Notas tipo post-it.

Propiedades:

- texto editable
- tipografía manuscrita simulada
- anclaje a objeto o región
- puede flotar o fijarse

---

## 3.4 Comments estructurados

Comentarios semánticos.

Propiedades:

- referencian objetos UDM
- pueden enlazar otros documentos
- pueden contener preguntas o hipótesis

---

## 3.5 Semantic Annotations

Anotaciones con significado dentro del grafo:

- “esto contradice esto”
- “esto es evidencia de X”
- “esto es ejemplo de Y”
- “esto es definición”

---

# 4. Sistema de anclaje

Cada anotación puede anclarse a:

- Object ID (UDM)
- rango de objetos
- región visual (LDM)
- estructura lógica (SDM)

---

# 5. Representación interna

Las anotaciones se modelan como:

```text
Annotation:
  id: A1
  type: Highlight
  targetObjects: [P3, P4]
  layer: semantic
  persistence: true
```

---

# 6. Integración con Knowledge Graph

Las anotaciones pueden generar relaciones:

- supports
- contradicts
- explains
- questions
- extends

Ejemplo:

```text
Annotation A1 → supports → Concept C7
```

---

# 7. Sistema de colores semánticos

Los colores no son decorativos.

Tienen significado:

- amarillo → concepto importante
- azul → definición
- rojo → contradicción o alerta
- verde → confirmación o evidencia
- violeta → hipótesis

---

# 8. Persistencia

Las anotaciones:

- sobreviven cambios de layout
- sobreviven cambios de modo de lectura
- sobreviven exportaciones
- sobreviven versiones del documento

---

# 9. Interacción

El usuario puede:

- convertir highlight → nota
- convertir nota → relación semántica
- conectar anotaciones entre documentos
- buscar anotaciones globales

---

# 10. Versionado

Las anotaciones pueden evolucionar:

- editadas
- fusionadas
- refactorizadas
- convertidas en conocimiento estructurado

---

# 11. Reglas

## R-001

Toda anotación debe estar anclada a al menos un objeto UDM.

---

## R-002

Las anotaciones no pueden existir sin contexto.

---

## R-003

Las anotaciones no modifican el contenido original.

---

## R-004

Las anotaciones son parte del grafo de conocimiento.

---

# 12. Objetivo de diseño

Convertir la lectura en un proceso activo de construcción de conocimiento.

---

# 13. Principio fundamental

Anotar no es marcar texto.

Es construir conocimiento encima del conocimiento.
