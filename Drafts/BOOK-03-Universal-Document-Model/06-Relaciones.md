
# 6. Relaciones

Versión: 1.0
Estado: Draft

---

# 6.1 Propósito

Las Relaciones definen la forma en que los Objetos interactúan entre sí.

Un Objeto aislado posee información.

Un conjunto de Objetos relacionados constituye conocimiento.

Las Relaciones son Objetos de primer nivel dentro del UDM.

No son atributos.

No son referencias implícitas.

Toda Relación posee identidad propia.

---

# 6.2 Principios

### REL-001

Toda Relación conecta exactamente dos Objetos.

---

### REL-002

Toda Relación posee un origen.

---

### REL-003

Toda Relación posee un destino.

---

### REL-004

Toda Relación posee un tipo.

---

### REL-005

Toda Relación podrá contener metadatos.

---

### REL-006

Las Relaciones son direccionadas.

---

### REL-007

Las Relaciones podrán evolucionar independientemente de los Objetos.

---

# 6.3 Estructura

Toda Relación deberá contener:

ID

Tipo

Origen

Destino

Fecha de creación

Autor

Versión

Estado

Metadatos

Nivel de confianza (opcional)

---

# 6.4 Tipos de Relaciones

Las siguientes Relaciones forman parte de la especificación UDM.

---

## CONTIENE

Representa pertenencia lógica.

Ejemplo:

Documento

↓

Capítulo

---

## PERTENECE_A

Relación inversa de CONTIENE.

---

## SIGUE_A

Define orden de lectura.

Ejemplo

Párrafo 1

↓

Párrafo 2

---

## REFERENCIA

Un Objeto hace referencia a otro.

Ejemplo

Texto

↓

Figura

---

## CITA

Referencia bibliográfica.

---

## ENLAZA

Hipervínculo.

---

## DEPENDE_DE

Un Objeto requiere otro para ser interpretado.

Ejemplo

Nota al pie

↓

Referencia

---

## DERIVA_DE

El contenido fue generado a partir de otro.

Ejemplo

Resumen IA

↓

Documento

---

## GENERADO_POR

Identifica el origen del Objeto.

Ejemplo

Resumen

↓

Modelo IA

---

## TRADUCCIÓN_DE

Relaciona versiones en distintos idiomas.

---

## DUPLICA

Representa duplicación lógica.

---

## SIMILAR_A

Relación semántica.

---

## RELACIONADO_CON

Relación genérica.

---

# 6.5 Cardinalidad

Una Relación conecta exactamente:

1 origen

1 destino

No existen Relaciones múltiples.

Las Relaciones complejas deberán representarse mediante múltiples Relaciones simples.

---

# 6.6 Ciclo de Vida

Las Relaciones poseen ciclo de vida independiente.

Una Relación puede:

Crearse

Actualizarse

Versionarse

Eliminarse

Sin afectar la existencia de los Objetos conectados.

---

# 6.7 Metadatos

Toda Relación podrá almacenar.

Autor

Fuente

Confianza

Comentarios

Etiquetas

Fecha

Motor generador

Modelo IA

---

# 6.8 Reglas

REL-R001

Un Objeto puede poseer infinitas Relaciones.

REL-R002

Las Relaciones nunca modifican el contenido.

REL-R003

Eliminar una Relación nunca elimina un Objeto.

REL-R004

Toda Relación deberá poder reconstruirse.

REL-R005

Las Relaciones podrán indexarse.

REL-R006

Las Relaciones podrán sincronizarse independientemente.

---

# 6.9 Ejemplo

Documento

↓

CONTIENE

↓

Capítulo

↓

CONTIENE

↓

Sección

↓

CONTIENE

↓

Párrafo

↓

REFERENCIA

↓

Figura

↓

CITA

↓

Bibliografía
