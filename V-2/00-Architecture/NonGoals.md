
# Non-Goals

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

Documentos relacionados:

- Vision.md
- Principles.md
- Constraints.md
- TechnologyStrategy.md
- Roadmap.md

---

# 1. Propósito

Este documento define explícitamente aquello que KnowledgeOS no pretende ser.

Los Non-Goals ayudan a mantener el foco del proyecto y sirven como criterio para evaluar futuras propuestas de funcionalidades.

La ausencia de una capacidad en este documento no implica que nunca vaya a desarrollarse, sino que actualmente no forma parte de la visión de la plataforma.

---

# 2. Principios

Un Non-Goal puede modificarse únicamente mediante una decisión arquitectónica (ADR) o una revisión de la visión del producto.

---

# 3. No reemplazar aplicaciones de edición

KnowledgeOS no pretende convertirse en un editor general de documentos.

No es un reemplazo de:

- Microsoft Word
- Apple Pages
- LibreOffice
- Google Docs

Su propósito es comprender, organizar y enriquecer conocimiento, no editar el contenido original.

---

# 4. No modificar documentos originales

KnowledgeOS no tiene como objetivo escribir cambios sobre el archivo fuente.

Las anotaciones, estructuras y metadatos pertenecen a la plataforma, no al documento original.

---

# 5. No depender de la nube

El producto no requiere servicios en la nube para ofrecer sus funcionalidades principales.

La sincronización o servicios remotos podrán existir como capacidades adicionales, pero no serán obligatorios.

---

# 6. No depender de un proveedor de IA

KnowledgeOS no estará ligado a un modelo, empresa o proveedor específico de inteligencia artificial.

La arquitectura debe permitir sustituir o incorporar modelos sin modificar el núcleo.

---

# 7. No almacenar conocimiento únicamente en formatos propietarios

Siempre que sea posible, los datos deberán almacenarse utilizando formatos documentados y con posibilidad de exportación.

La plataforma debe evitar el bloqueo tecnológico.

---

# 8. No sacrificar la arquitectura por incorporar funcionalidades

Una nueva característica no justifica romper los principios, restricciones o atributos de calidad definidos por la plataforma.

Cuando exista conflicto, la arquitectura tiene prioridad.

---

# 9. No ocultar procesos automáticos

Las operaciones que transformen o generen conocimiento deberán ser explicables y trazables.

KnowledgeOS no pretende comportarse como una "caja negra".

---

# 10. No sustituir el criterio del usuario

La inteligencia artificial asiste al usuario, pero no toma decisiones en su nombre.

Las recomendaciones siempre podrán ser revisadas, aceptadas o descartadas.

---

# 11. No comprometer la privacidad por conveniencia

No se enviarán documentos o información del usuario a servicios externos sin consentimiento explícito.

La facilidad de uso nunca tendrá prioridad sobre la privacidad.

---

# 12. Revisión

Los Non-Goals deberán revisarse cuando cambien la visión del producto o los objetivos estratégicos de la plataforma.

Toda modificación deberá documentarse y justificarse.

---

# 13. Principio Fundamental

Cada nueva funcionalidad deberá responder primero a la siguiente pregunta:

"¿Acerca a KnowledgeOS a su propósito principal o lo aleja de él?"

Si la respuesta no es clara, la funcionalidad deberá replantearse antes de incorporarse.
