# UDM Validation Rules

Version: 1.0

Status: Draft

---

# Reglas

Existe un único nodo Document.

---

Todo nodo posee UUID.

---

Todo nodo posee tipo.

---

Todo nodo tiene un único padre.

Excepto Document.

---

No existen ciclos.

---

Todo hijo pertenece al mismo documento.

---

Todo Anchor referencia un nodo existente.

---

Toda Annotation referencia un Anchor válido.

---

Todo Asset existe físicamente.

---

Todo nodo puede serializarse.

---

Todo documento puede reconstruirse únicamente a partir del UDM.

---

Las capas Semantic y Annotation nunca modifican Content.
