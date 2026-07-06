
# CAP-002 — Reading Experience

Versión: 0.1
Estado: Diseño

---

# 1. Propósito

Reading Experience define cómo el conocimiento almacenado en KnowledgeOS
es presentado al usuario.

No es un “viewer”.

Es un sistema de **representación dinámica del mismo UDM**.

---

# 2. Principio fundamental

Un mismo UDM puede representarse como:

- libro
- revista
- paper científico
- documento técnico
- página web
- modo markdown
- vista anotada

sin duplicar contenido.

---

# 3. Entrada

- Universal Document Model (UDM)
- Layout Document Model (LDM)
- anotaciones del usuario
- contexto de lectura

---

# 4. Salidas (Render Modes)

---

## 4.1 Book Mode

- lectura continua
- tipografía serif
- flujo vertical
- énfasis en capítulos
- navegación secuencial

---

## 4.2 Magazine Mode

- columnas
- bloques visuales
- jerarquía editorial
- énfasis en imágenes
- lectura no lineal

---

## 4.3 Paper Mode

- estructura académica
- referencias visibles
- figuras numeradas
- citas activas
- estilo formal

---

## 4.4 Markdown Mode

- estructura limpia
- jerarquía explícita
- sin layout complejo
- ideal para exportación

---

## 4.5 Web Mode

- layout responsive
- interacción dinámica
- links internos del grafo
- scroll híbrido

---

## 4.6 Annotation Mode

- resaltados activos
- notas flotantes
- dibujos
- post-its digitales
- escritura a mano

---

# 5. Sistema de Render

Todos los modos consumen el mismo UDM.

El render no transforma el conocimiento.

Solo lo proyecta.

---

# 6. Layout Binding

El sistema usa:

- LDM (layout original)
- preferencias del usuario
- dispositivo
- modo seleccionado

para construir la vista final.

---

# 7. Interacción unificada

El usuario puede:

- seleccionar texto
- resaltar
- comentar
- dibujar
- buscar dentro del documento
- saltar a relaciones del grafo

sin cambiar de modo de datos.

---

# 8. Sistema de Highlight

Los highlights son:

- independientes del modo visual
- anclados a objetos UDM
- persistentes
- sincronizables

Ejemplo:

```text
Object: P3
Highlight:
  type: fluorescent-yellow
  opacity: 0.35
  style: rounded
```

---

# 9. Notas tipo post-it

Las notas son objetos UDM extendidos:

- contenido editable
- tipografía manuscrita simulada
- anclaje a objetos o regiones
- pueden flotar o fijarse

---

# 10. Sistema de escritura a mano

- soporte Apple Pencil
- vector ink
- conversión opcional a texto
- persistencia como capa separada

---

# 11. Reglas

## R-001

Todos los modos consumen el mismo UDM.

---

## R-002

Ningún modo puede modificar el contenido del documento.

---

## R-003

Las anotaciones son independientes del render.

---

## R-004

El cambio de modo no implica recarga de datos.

---

# 12. Objetivo de diseño

Separar completamente:

- conocimiento (UDM)
- representación (UI modes)

---

# 13. Principio fundamental

El documento no cambia.

Solo cambia la forma en la que el usuario lo percibe.
