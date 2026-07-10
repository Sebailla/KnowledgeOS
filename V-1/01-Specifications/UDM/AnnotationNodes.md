
# UDM Annotation Nodes

Version: 1.0

Status: Draft

---

# Objetivo

Representar todo el conocimiento generado por el usuario.

---

# Tipos

Highlight

Underline

Strike

Bookmark

StickyNote

TextNote

Ink

Comment

Arrow

Shape

Attachment

---

# Principios

Las anotaciones:

- nunca modifican el documento;
- siempre referencian un Anchor;
- poseen identidad propia;
- pueden sincronizarse independientemente;
- pueden versionarse independientemente.

---

# Render

El Render Engine decide cómo representar visualmente cada tipo de anotación.

El UDM únicamente define su estructura lógica.
