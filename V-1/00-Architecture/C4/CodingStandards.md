
# PlantUML Coding Standards

## Reglas

### 1. Un elemento por línea

Correcto

System(kos, "KnowledgeOS", "Knowledge Platform")

Incorrecto

System(
    kos,
    "KnowledgeOS",
    "Knowledge Platform"
)

---

### 2. Relaciones en una línea

Rel(user, kos, "Uses")

---

### 3. No utilizar identificadores reservados

Incorrecto

System(system, ...)

Correcto

System(kos, ...)

---

### 4. Mantener identificadores cortos

user
kos
nas
ocr
ai
core
sync

---

### 5. Los títulos siempre en una línea

title KnowledgeOS - System Context

---

### 6. Un único tipo de diagrama por archivo

Nunca mezclar Context, Container y Component.

---

### 7. Usar únicamente la librería C4 local

Nunca usar:

!includeurl

Siempre:

!include ../../_includes/C4_Context.puml
