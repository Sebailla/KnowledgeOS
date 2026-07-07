
# Configuration Manager

Versión: 1.0
Estado: Approved
Última actualización: 2026-07-06

---

# Propósito

Centralizar el acceso a la configuración global de la plataforma.

---

# Responsabilidades

- Cargar configuración.
- Validar configuración.
- Exponer configuración a los Engines.
- Gestionar cambios de configuración.

---

# Alcance

Incluye:

- Workspace activo.
- Preferencias del usuario.
- Configuración de Engines.
- Rutas de almacenamiento.
- Proveedores externos.

---

# Reglas

- Existe una única instancia de configuración activa.
- Los Engines acceden mediante el Configuration Manager.
- La configuración se considera de solo lectura durante la ejecución, salvo cambios explícitos del usuario.

---

# Operaciones

- Load()
- Save()
- Get()
- Reload()

---

# Principio Fundamental

La configuración es un servicio compartido, nunca una dependencia entre Engines.
