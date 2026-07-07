
# Configuration

Versión: 1.0
Estado: Approved

---

# Propósito

Definir la configuración global de la plataforma.

# Alcance

La configuración incluye:

- preferencias del usuario;
- configuración de Engines;
- rutas de almacenamiento;
- proveedores externos;
- opciones experimentales.

# Reglas

- Toda configuración posee un valor por defecto.
- Los Engines leen la configuración, no la comparten directamente.
- La configuración es versionada.

# Principio Fundamental

La configuración centraliza el comportamiento, no la lógica de negocio.
