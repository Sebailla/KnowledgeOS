# UDM Node Attributes

Version: 1.0

Status: Draft

---

# Objetivo

Definir los atributos comunes de todos los nodos del Universal Document Model.

Todo nodo hereda estos atributos.

---

# BaseNode

---

documentId

UUID

Documento propietario

---

contentHash

SHA-256

Hash del contenido lógico.

---

nodePath

Ruta absoluta.

Ejemplo

/document/chapter[2]/section[1]/paragraph[5]

---

logicalOrder

Orden lógico.

---

physicalOrder

Orden físico dentro del documento original.


---

type

String

Tipo del nodo.

Ejemplos

Paragraph

Heading

Table

Image

Highlight

---

parentId

UUID

Nodo padre.

El nodo raíz no posee parentId.

---

order

Integer

Posición entre sus hermanos.

---

path

String

Ruta absoluta dentro del árbol.

Ejemplo

/document/chapter[2]/section[1]/paragraph[4]

---

createdAt

Timestamp

Fecha de creación.

---

updatedAt

Timestamp

Última modificación.

---

version

Integer

Versión del nodo.

---

metadata

Dictionary

Información adicional.

---

attributes

Dictionary

Propiedades específicas del nodo.

---

flags

Dictionary

Estados internos.

Ejemplos

locked

hidden

deleted

generated
