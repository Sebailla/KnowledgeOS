
# 7. Modelo de Documento

Versión: 1.0
Estado: Draft

---

# 7.1 Propósito

Este documento define qué es un Documento dentro del Universal
Document Model.

Un Documento constituye la unidad lógica principal utilizada por el
usuario para organizar conocimiento.

Un Documento no representa un archivo.

Un Documento representa un subgrafo del Universal Document Model.

---

# 7.2 Definición

Un Documento es un Objeto Raíz.

Todo Documento deberá poseer:

• identidad propia

• metadatos

• estructura lógica

• relaciones

• recursos

• historial

• configuración de lectura

• preferencias de representación

---

# 7.3 Principios

DOC-001

El Documento nunca depende del formato de origen.

---

DOC-002

El Documento puede originarse a partir de uno o varios archivos.

---

DOC-003

El Documento puede contener cualquier tipo de Objeto definido por el UDM.

---

DOC-004

El Documento no almacena páginas.

Las páginas pertenecen únicamente al layout del archivo original.

---

DOC-005

El Documento preserva el orden lógico de lectura.

---

DOC-006

El Documento podrá poseer múltiples representaciones visuales.

---

DOC-007

El Documento mantiene una referencia permanente a sus archivos de origen.

---

# 7.4 Componentes

Todo Documento podrá contener:

Capítulos

Secciones

Párrafos

Listas

Tablas

Figuras

Imágenes

Ecuaciones

Código

Notas

Bibliografía

Apéndices

Recursos

Objetos Semánticos

Anotaciones

---

# 7.5 Relaciones

Un Documento podrá establecer relaciones con:

otros Documentos

Colecciones

Cuadernos

Conceptos

Referencias

Bibliografía

Usuarios

Modelos IA

---

# 7.6 Estado

Todo Documento posee un ciclo de vida.

Creado

↓

Importado

↓

Procesado

↓

Validado

↓

Disponible

↓

Archivado

↓

Eliminado

---

# 7.7 Persistencia

El Documento deberá poder persistirse completamente.

La persistencia deberá conservar:

estructura

contenido

relaciones

anotaciones

recursos

versiones

metadatos

---

# 7.8 Restricciones

El Documento nunca contendrá información específica del Renderizador.

El Documento nunca almacenará coordenadas de pantalla.

El Documento nunca dependerá de una tipografía determinada.

El Documento nunca dependerá de un tamaño de ventana.

---

# 7.9 Compatibilidad

Toda futura versión del UDM deberá poder interpretar un Documento
generado por versiones anteriores.

La compatibilidad hacia atrás constituye un requisito obligatorio.
