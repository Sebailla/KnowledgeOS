# Managers

Versión: 0.1
Estado: Working Draft

---

# 1. Introducción

Los Managers constituyen las unidades fundamentales de responsabilidad
dentro del Knowledge Engine.

Cada Manager es el propietario exclusivo de un dominio funcional.

Toda modificación del conocimiento deberá realizarse a través del Manager
correspondiente.

Ningún Manager podrá modificar directamente el estado administrado por
otro Manager.

La colaboración entre Managers se realizará mediante contratos públicos y
eventos internos.

---

# 2. Principios

## MGR-001

Cada dominio posee exactamente un Manager propietario.

---

## MGR-002

Cada Manager administra un único dominio.

---

## MGR-003

Los Managers no contienen lógica de interfaz gráfica.

---

## MGR-004

Los Managers desconocen el formato de los archivos.

---

## MGR-005

Los Managers nunca realizan renderizado.

---

## MGR-006

Los Managers son independientes de la plataforma.

---

## MGR-007

Toda modificación persistente del conocimiento pasa por un Manager.

---

# 3. Catálogo de Managers

La primera versión de KnowledgeOS define los siguientes Managers.

---

## Object Manager

Responsabilidad:

Administrar el ciclo de vida de todos los Objetos.

Funciones:

- crear Objetos;
- actualizar Objetos;
- eliminar lógicamente;
- recuperar Objetos;
- asignar identidad;
- validar metadatos mínimos.

No puede:

- crear relaciones;
- renderizar contenido;
- importar archivos.

---

## Relation Manager

Responsabilidad:

Administrar las relaciones del Grafo.

Funciones:

- crear Relaciones;
- eliminar Relaciones;
- validar cardinalidad;
- mantener integridad referencial;
- evitar ciclos inválidos cuando corresponda.

No puede:

- modificar Objetos.

---

## Document Manager

Responsabilidad:

Administrar Documentos como entidades lógicas.

Funciones:

- crear Documentos;
- organizar estructura;
- administrar capítulos;
- administrar secciones;
- mantener metadatos del documento.

No interpreta formatos externos.

---

## Resource Manager

Responsabilidad:

Administrar recursos binarios.

Funciones:

- imágenes;
- audio;
- vídeo;
- tipografías;
- archivos adjuntos;
- recursos externos.

El Resource Manager nunca interpreta el contenido del recurso.

---

## Annotation Manager

Responsabilidad:

Administrar todas las anotaciones del usuario.

Funciones:

- resaltados;
- subrayados;
- notas adhesivas;
- dibujos;
- comentarios;
- marcadores.

Las anotaciones siempre se asocian a Objetos del UDM.

Nunca a coordenadas absolutas.

---

## Query Manager

Responsabilidad:

Resolver consultas sobre el conocimiento.

Funciones:

- búsqueda;
- filtros;
- navegación;
- consultas estructuradas;
- consultas semánticas.

No mantiene índices.

Utiliza los motores especializados disponibles.

---

## Version Manager

Responsabilidad:

Administrar la evolución del conocimiento.

Funciones:

- versiones;
- revisiones;
- restauración;
- comparación;
- historial.

---

## Validation Manager

Responsabilidad:

Garantizar la consistencia del sistema.

Funciones:

- validar Objetos;
- validar Relaciones;
- validar modelos;
- detectar inconsistencias;
- generar diagnósticos.

---

## Event Manager

Responsabilidad:

Distribuir eventos internos.

Funciones:

- publicación;
- suscripción;
- propagación;
- auditoría.

No contiene lógica de negocio.

---

## Transaction Manager

Responsabilidad:

Garantizar operaciones atómicas.

Funciones:

- iniciar transacciones;
- confirmar cambios;
- revertir operaciones;
- recuperación ante errores.

---

# 4. Comunicación

Los Managers nunca accederán directamente al estado interno de otros
Managers.

Toda interacción se realizará mediante contratos públicos.

Cuando sea posible, la comunicación se realizará mediante eventos.

---

# 5. Dependencias

Las dependencias entre Managers deberán minimizarse.

El diseño deberá favorecer el bajo acoplamiento y la alta cohesión.

Las dependencias circulares están prohibidas.

---

# 6. Evolución

La incorporación de un nuevo Manager no deberá modificar el
comportamiento de los Managers existentes.

Todo nuevo dominio deberá evaluarse antes de introducir un Manager
adicional.

---

# 7. Principio Fundamental

Todo conocimiento administrado por KnowledgeOS posee un único Manager
responsable.

No existen responsabilidades compartidas.
