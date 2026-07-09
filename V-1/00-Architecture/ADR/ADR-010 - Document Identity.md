
# ADR-010 - Document Identity

**Estado:** Accepted

---

# Contexto

KnowledgeOS necesita identificar de forma permanente cada documento y cada objeto del conocimiento.

La identidad no puede depender del nombre del archivo ni de su ubicación.

---

# Decisión

Todo objeto persistente posee una identidad permanente.

La identidad nunca cambia durante la vida del objeto.

---

# Identidad del documento

Cada documento posee:

- UUID
- Hash del original
- Fecha de importación
- Formato original
- Versión del procesamiento

---

# Identidad de objetos UDM

Cada objeto del UDM posee:

- UUID
- Tipo
- Padre
- Relaciones

---

# Identidad de anotaciones

Cada anotación posee:

- UUID
- Documento
- Objeto UDM
- Autor
- Fecha

Nunca depende de coordenadas.

---

# Identidad de Assets

Cada Asset posee:

- UUID
- Documento asociado
- Tipo
- Hash

---

# Principios

La identidad:

- es permanente;
- es independiente del almacenamiento;
- es independiente del nombre;
- es independiente de la plataforma.

---

# Consecuencias

## Positivas

- Sincronización robusta.
- Deduplicación.
- Referencias estables.
- Versionado consistente.

## Negativas

- Mayor cantidad de metadatos.

---

# Alternativas consideradas

Nombre del archivo.

Descartado.

Ruta del archivo.

Descartada.

Hash como identidad.

Descartado porque cambia cuando el documento cambia.

---

# Decisiones congeladas

1. Todo objeto persistente posee UUID.
2. La identidad nunca depende del nombre.
3. La identidad nunca depende de la ubicación.
4. El hash identifica contenido, no identidad.
5. Todas las relaciones utilizan UUID.
