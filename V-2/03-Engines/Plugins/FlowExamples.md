# Flow Examples

Versión: 1.0
Estado: Draft

---

## FE-001 Cargar un plugin

1. El Plugin Engine descubre el plugin.
2. Valida la compatibilidad.
3. Registra el plugin.
4. Inicializa el plugin.
5. Publica `PluginStarted`.

---

## FE-002 Actualizar un plugin

1. Se detecta una nueva versión.
2. Se detiene el plugin actual.
3. Se carga la nueva versión.
4. Se inicializa nuevamente.
5. Se actualiza el registro.

---

## FE-003 Desinstalar un plugin

1. El usuario solicita la desinstalación.
2. El Plugin Engine detiene el plugin.
3. Lo elimina del registro.
4. Libera los recursos.
5. Publica `PluginUnloaded`.
