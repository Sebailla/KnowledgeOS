
# Repositories

Versión: 1.0
Estado: Draft

---

# Propósito

Los Repositories abstraen el acceso a la persistencia.

Los Engines nunca interactúan directamente con el almacenamiento físico.

---

# Responsabilidades

- Crear.
- Leer.
- Actualizar.
- Eliminar.
- Consultar.

---

# Reglas

- Un Repository administra un único agregado o tipo de objeto.
- No contiene lógica de negocio.
- Es independiente de la tecnología de almacenamiento.

---

# Principio Fundamental

Los Repositories desacoplan el dominio de la persistencia.
