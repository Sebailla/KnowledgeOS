
# CAP-004 — Knowledge Search & Exploration

Versión: 0.1
Estado: Diseño

---

# 1. Propósito

Knowledge Search permite explorar el Knowledge Graph de forma:

- semántica
- estructural
- contextual
- relacional

No es un buscador de archivos.

Es un sistema de **descubrimiento de conocimiento**.

---

# 2. Principio fundamental

El usuario no busca documentos.

El usuario busca:

- ideas
- conceptos
- evidencias
- relaciones
- contradicciones
- explicaciones

---

# 3. Entrada

La búsqueda puede partir de:

- texto libre
- pregunta natural
- nodo UDM
- anotación
- relación
- concepto
- documento completo

---

# 4. Salida

La salida es un:

> **Knowledge Exploration Graph (KEG)**

Incluye:

- nodos relevantes
- relaciones entre nodos
- contexto expandido
- niveles de relevancia
- rutas de conocimiento

---

# 5. Tipos de búsqueda

---

## 5.1 Semantic Search

Busca por significado.

Ejemplo:

- “causas de hiponatremia”
- “papers que contradicen este estudio”

---

## 5.2 Structural Search

Busca por estructura:

- todos los abstracts
- todas las conclusiones
- todas las tablas comparativas

---

## 5.3 Graph Search

Explora relaciones:

- qué conecta con qué
- qué depende de qué
- qué contradice qué

---

## 5.4 Hybrid Search

Combina:

- texto
- grafo
- layout
- anotaciones

---

# 6. Knowledge Exploration Graph (KEG)

El KEG no es una lista de resultados.

Es un subgrafo dinámico del Knowledge Graph global.

Incluye:

- nodos relevantes
- nodos secundarios
- relaciones activas
- caminos de inferencia

---

# 7. Expansión progresiva

La búsqueda puede expandirse:

Nivel 0 → resultado directo
Nivel 1 → contexto
Nivel 2 → relaciones
Nivel 3 → conocimiento relacionado
Nivel 4 → inferencias

---

# 8. Ranking de relevancia

El ranking considera:

- similitud semántica
- posición en el grafo
- peso de relaciones
- frecuencia de uso
- anotaciones del usuario
- contexto actual

---

# 9. Navegación

El usuario puede:

- saltar entre nodos
- expandir relaciones
- seguir caminos de conocimiento
- guardar rutas de exploración

---

# 10. Queries avanzadas

Ejemplos:

- “muéstrame contradicciones sobre este tema”
- “qué evidencia soporta este concepto”
- “qué documentos dependen de este paper”
- “explora este concepto en profundidad”

---

# 11. Integración con anotaciones

Las anotaciones pueden:

- alimentar la búsqueda
- filtrar resultados
- generar nuevos nodos
- crear rutas personalizadas

---

# 12. Reglas

## R-001

La búsqueda nunca modifica el Knowledge Graph.

---

## R-002

La búsqueda solo genera vistas derivadas.

---

## R-003

Toda relación mostrada debe existir o ser inferida con marca de
confianza.

---

## R-004

La búsqueda puede ser incompleta, pero nunca engañosa.

---

# 13. Objetivo de diseño

Transformar la búsqueda en exploración activa del conocimiento.

---

# 14. Principio fundamental

Buscar no es encontrar documentos.

Es navegar conocimiento conectado.
