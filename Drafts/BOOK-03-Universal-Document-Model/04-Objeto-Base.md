
# 4. Objeto Base

## 4.1 Propósito

El Objeto constituye la unidad fundamental del Universal Document Model.

Todo elemento administrado por KnowledgeOS deberá estar representado por un Objeto.

No existen excepciones.

El Objeto define el contrato mínimo que todos los elementos del sistema deberán cumplir.

---

## 4.2 Principios

Todo Objeto deberá cumplir los siguientes principios.

### UDM-OBJ-001

Todo Objeto posee identidad propia.

### UDM-OBJ-002

Todo Objeto puede existir independientemente.

### UDM-OBJ-003

Todo Objeto puede relacionarse con otros Objetos.

### UDM-OBJ-004

Todo Objeto puede evolucionar mediante versiones.

### UDM-OBJ-005

Todo Objeto puede ser serializado.

### UDM-OBJ-006

Todo Objeto puede ser indexado.

### UDM-OBJ-007

Todo Objeto puede ser referenciado desde cualquier otro Objeto.

---

# 4.3 Identidad

Cada Objeto deberá poseer un identificador permanente.

El identificador deberá cumplir las siguientes condiciones.

• Globalmente único.

• Inmutable.

• Independiente del almacenamiento.

• Independiente del dispositivo.

• Independiente del documento.

El identificador nunca deberá reutilizarse.

---

# 4.4 Estado

Todo Objeto deberá encontrarse exactamente en uno de los siguientes estados.

• Creado

• Importado

• Procesado

• Validado

• Disponible

• Archivado

• Eliminado

Las transiciones entre estados serán definidas en el documento
"Ciclo de Vida".

---

# 4.5 Propiedades Obligatorias

Todo Objeto deberá contener, como mínimo, las siguientes propiedades.

| Propiedad           | Obligatoria |
| ------------------- | ----------- |
| id                  | Sí         |
| tipo                | Sí         |
| versión            | Sí         |
| fechaCreación      | Sí         |
| fechaActualización | Sí         |
| estado              | Sí         |
| propietario         | Sí         |
| origen              | Sí         |

Ninguna implementación podrá eliminar estas propiedades.

---

# 4.6 Propiedades Opcionales

Las siguientes propiedades podrán existir según el tipo de Objeto.

• título

• descripción

• idioma

• etiquetas

• autor

• licencia

• categoría

• icono

• color

• miniatura

• nivel de confianza

La ausencia de estas propiedades no invalidará el Objeto.

---

# 4.7 Invariantes

Las siguientes condiciones deberán cumplirse siempre.

### INV-001

El identificador nunca cambia.

### INV-002

La versión nunca disminuye.

### INV-003

Un Objeto eliminado conserva su historial.

### INV-004

Las relaciones nunca modifican la identidad del Objeto.

### INV-005

Un Objeto nunca pertenece físicamente a otro.

La pertenencia siempre se expresa mediante Relaciones.

### INV-006

Todo Objeto puede existir aislado.

---

# 4.8 Contenido

El contenido pertenece al Objeto.

La representación visual no.

Un mismo contenido podrá representarse mediante múltiples renderizadores.

El contenido constituye la fuente de verdad.

---

# 4.9 Metadatos

Los metadatos describen al Objeto.

Nunca forman parte del contenido.

Los metadatos podrán modificarse sin alterar el contenido.

---

# 4.10 Relaciones

Las relaciones no forman parte del contenido.

Las relaciones describen conexiones entre Objetos.

Las relaciones serán tratadas como Objetos independientes.

---

# 4.11 Historial

Todo Objeto podrá mantener un historial completo de cambios.

Cada cambio deberá registrar.

• fecha

• autor

• operación

• versión

• motivo (opcional)

---

# 4.12 Extensibilidad

Los Objetos podrán incorporar propiedades adicionales.

Las extensiones nunca podrán modificar las propiedades obligatorias.

Las extensiones deberán preservar compatibilidad hacia atrás.

---

# 4.13 Independencia

El Objeto Base no dependerá de.

• PDF

• EPUB

• Markdown

• CHM

• HTML

• DOCX

• motores OCR

• motores IA

• interfaces gráficas

• bases de datos

• sistemas operativos

El Objeto Base constituye una abstracción pura.

---

# 4.14 Contrato

Toda implementación del Universal Document Model deberá cumplir este contrato.

Una implementación que incumpla cualquiera de los requisitos obligatorios no será considerada compatible con KnowledgeOS.
