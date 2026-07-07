# Rendering Engine Overview

Versión: 1.0
Estado: Draft

---

# Propósito

Renderizar el UDM de forma consistente en cualquier interfaz de usuario.

---

# Flujo

UDM
↓
Layout
↓
Theme
↓
Renderer
↓
Visual Output

---

# Responsabilidades

- Interpretar el UDM.
- Calcular el layout.
- Aplicar estilos.
- Construir la representación visual.

---

# Eventos publicados

- RenderingStarted
- RenderingCompleted
- RenderingFailed

---

# Eventos consumidos

- DocumentUpdated
- ThemeChanged

---

# Principio Fundamental

El Rendering Engine solo consume el UDM; nunca modifica el modelo documental.
