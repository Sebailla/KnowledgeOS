# Search Pipeline

Versión: 1.0
Estado: Draft

---

# Etapas

1. Recibir consulta.
2. Validar consulta.
3. Seleccionar índices.
4. Ejecutar búsqueda.
5. Calcular ranking.
6. Devolver resultados.

---

# Reglas

- El pipeline nunca modifica datos.
- Una consulta inválida finaliza inmediatamente.
- Los resultados mantienen un orden definido.
