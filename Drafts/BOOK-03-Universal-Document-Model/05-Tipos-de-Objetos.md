
# 5. Tipos de Objetos

## 5.1 Propósito

El Universal Document Model define un conjunto finito de tipos de Objetos.

Cada Objeto representa una unidad lógica de información.

El tipo determina el propósito del Objeto.

El tipo nunca determina su representación visual.

La representación visual será responsabilidad exclusiva de los Renderizadores.

---

# 5.2 Clasificación General

Todos los Objetos pertenecen exactamente a una de las siguientes categorías.

• Objetos Raíz

• Objetos Estructurales

• Objetos de Contenido

• Objetos de Recursos

• Objetos de Anotación

• Objetos de Referencia

• Objetos Semánticos

• Objetos de Sistema

---

# 5.3 Objetos Raíz

Los Objetos Raíz representan unidades completas de conocimiento.

Pueden existir independientemente.

Son el punto de entrada de un documento.

Tipos definidos.

• Documento

• Cuaderno

• Biblioteca

• Colección

Cada Objeto Raíz posee su propio ciclo de vida.

---

# 5.4 Objetos Estructurales

Los Objetos Estructurales organizan el contenido.

No contienen significado por sí mismos.

Su función es proporcionar estructura lógica.

Tipos definidos.

• Parte

• Capítulo

• Sección

• Subsección

• Apéndice

• Índice

• Glosario

• Bibliografía

---

# 5.5 Objetos de Contenido

Representan conocimiento explícito.

Son la unidad principal utilizada durante la lectura.

Tipos definidos.

• Párrafo

• Lista

• Elemento de Lista

• Tabla

• Celda

• Imagen

• Figura

• Ecuación

• Bloque de Código

• Cita

• Nota

• Texto

---

# 5.6 Objetos de Recursos

Representan contenido binario o multimedia.

Tipos definidos.

• Imagen Original

• Imagen Derivada

• Audio

• Vídeo

• Archivo Adjunto

• Fuente Tipográfica

• Icono

• SVG

• Recurso Externo

---

# 5.7 Objetos de Anotación

Representan información agregada por el usuario.

Nunca modifican el contenido original.

Tipos definidos.

• Resaltado

• Subrayado

• Tachado

• Nota Adhesiva

• Dibujo

• Comentario

• Grabación de Voz

• Marcador

• Etiqueta

---

# 5.8 Objetos de Referencia

Representan vínculos entre Objetos.

Tipos definidos.

• Referencia Cruzada

• Cita Bibliográfica

• Enlace

• Hipervínculo

• DOI

• PMID

• ISBN

---

# 5.9 Objetos Semánticos

Representan conocimiento inferido.

Podrán ser creados automáticamente.

Tipos definidos.

• Concepto

• Entidad

• Tema

• Persona

• Lugar

• Organización

• Palabra Clave

• Relación

• Embedding

• Resumen IA

• Flashcard

• Pregunta

• Respuesta

---

# 5.10 Objetos del Sistema

Representan información necesaria para el funcionamiento interno.

No forman parte del contenido visible.

Tipos definidos.

• Historial

• Versión

• Estado

• Permiso

• Configuración

• Índice

• Caché

• Registro

---

# 5.11 Jerarquía

Los Objetos podrán contener otros Objetos únicamente cuando la relación esté definida por esta especificación.

Las relaciones válidas serán definidas en el documento "Relaciones".

---

# 5.12 Cardinalidad

Todo Objeto pertenece exactamente a un Tipo.

Un Tipo puede poseer múltiples instancias.

Los Tipos son inmutables.

Una instancia nunca podrá cambiar de Tipo.

---

# 5.13 Extensibilidad

Nuevos Tipos podrán incorporarse mediante futuras versiones del UDM.

Las implementaciones deberán ignorar de forma segura los Tipos desconocidos.

La incorporación de nuevos Tipos nunca invalidará documentos existentes.
