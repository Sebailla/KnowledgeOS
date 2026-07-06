
# CAP-007 — System Memory & Personal Knowledge Layer

Versión: 0.1
Estado: Diseño

---

# 1. Propósito

La System Memory Layer permite a KnowledgeOS:

- recordar interacciones del usuario
- construir contexto personal de conocimiento
- adaptar resultados a patrones individuales
- evolucionar con el estilo de pensamiento del usuario

No es un historial.

Es un **modelo vivo de conocimiento personal**.

---

# 2. Principio fundamental

Cada usuario no solo usa el sistema.

Cada usuario **moldea su propio subgrafo de conocimiento**.

---

# 3. Tipos de memoria

---

## 3.1 Working Memory

Memoria activa de corto plazo:

- sesión actual
- contexto inmediato
- navegación reciente
- búsquedas actuales

---

## 3.2 Episodic Memory

Memoria de eventos:

- documentos importados
- anotaciones realizadas
- rutas de exploración
- decisiones tomadas

---

## 3.3 Semantic Personal Memory

Memoria de conocimiento del usuario:

- temas recurrentes
- intereses profesionales
- patrones de consulta
- conceptos dominados

---

## 3.4 Behavioral Memory

Memoria de comportamiento:

- cómo lee el usuario
- qué resalta
- qué ignora
- qué profundiza
- cómo navega el grafo

---

# 4. Personal Knowledge Graph (PKG)

Cada usuario tiene un subgrafo:

> Personal Knowledge Graph

Este subgrafo contiene:

- nodos relevantes para el usuario
- rutas frecuentes
- conceptos importantes
- anotaciones personales
- documentos clave

---

# 5. Personalización del sistema

El sistema adapta:

---

## 5.1 Ranking de búsqueda

- prioriza temas del usuario
- ajusta relevancia semántica
- reordena resultados

---

## 5.2 Synthesis bias

- explica conceptos en función del nivel del usuario
- adapta complejidad
- usa contexto previo

---

## 5.3 Navigation shortcuts

- sugiere rutas frecuentes
- anticipa exploraciones
- pre-carga conocimiento relevante

---

# 6. Aprendizaje del usuario

El sistema aprende:

- qué temas domina
- qué temas evita
- qué patrones de lectura usa
- cómo construye conocimiento

---

# 7. Privacidad y aislamiento

## R-001

La memoria personal es aislada por usuario.

---

## R-002

Ningún usuario puede acceder al PKG de otro usuario.

---

## R-003

La memoria personal no modifica el Knowledge Graph global.

---

## R-004

El usuario puede exportar o eliminar su memoria.

---

# 8. Evolución de la memoria

La memoria no es estática:

- se refuerza con uso
- se debilita con desuso
- se reorganiza con patrones nuevos

---

# 9. Integración con anotaciones

Las anotaciones del usuario:

- alimentan la memoria semántica
- fortalecen nodos del PKG
- crean rutas cognitivas personales

---

# 10. Integración con synthesis

La síntesis usa memoria para:

- contextualizar respuestas
- ajustar nivel técnico
- priorizar fuentes relevantes

---

# 11. Objetivo de diseño

Convertir KnowledgeOS en un sistema que:

- no solo almacena conocimiento
- sino que entiende cómo piensa el usuario

---

# 12. Principio fundamental

El sistema no recuerda archivos.

Recuerda relaciones entre el usuario y el conocimiento.
