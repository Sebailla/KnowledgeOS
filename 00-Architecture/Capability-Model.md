
# Capability Model

Versión: 0.1
Estado: Working Draft

---

# 1. Propósito

Una Capability representa una capacidad funcional ofrecida por
KnowledgeOS al usuario.

Las Capabilities constituyen el puente entre la arquitectura y el
producto.

Una Capability describe **qué** puede hacer el usuario.

No describe **cómo** se implementa.

---

# 2. Definición

Una Capability agrupa un conjunto coherente de Operations que permiten al
usuario alcanzar un objetivo específico.

Ejemplos:

- Importar documentos.
- Leer documentos.
- Anotar documentos.
- Buscar conocimiento.
- Traducir contenido.

---

# 3. Estructura

Toda Capability deberá definir:

- Nombre.
- Objetivo.
- Alcance.
- Operations incluidas.
- Managers involucrados.
- Modelos utilizados.
- Dependencias.
- Restricciones.
- Estado de implementación.

---

# 4. Relación con las Operations

Una Capability contiene una o más Operations.

Las Operations pertenecen exactamente a una Capability.

Una Operation nunca existirá de forma aislada.

---

# 5. Relación con los Managers

Las Capabilities no implementan reglas de negocio.

Las reglas pertenecen a los Managers.

Las Capabilities únicamente orquestan Operations para ofrecer una
funcionalidad completa al usuario.

---

# 6. Clasificación

Las Capabilities se clasifican en cuatro categorías.

## Fundamentales

Permiten utilizar KnowledgeOS.

Ejemplos:

- Biblioteca.
- Importación.
- Lectura.

---

## Productividad

Mejoran el trabajo cotidiano.

Ejemplos:

- Anotaciones.
- Búsqueda.
- Organización.

---

## Inteligencia

Amplían las capacidades del usuario.

Ejemplos:

- Resúmenes.
- Traducción.
- Flashcards.
- Mapas conceptuales.
- Preguntas y respuestas.

---

## Plataforma

Permiten extender el sistema.

Ejemplos:

- Plugins.
- Sincronización.
- Exportación.
- Automatización.

---

# 7. Ciclo de vida

Toda Capability atraviesa los siguientes estados.

Propuesta

↓

Aprobada

↓

Diseñada

↓

Implementada

↓

Validada

↓

Disponible

↓

Obsoleta

↓

Retirada

---

# 8. Versionado

Las Capabilities evolucionan de forma independiente.

La incorporación de una nueva Capability no deberá modificar el
comportamiento de las existentes.

---

# 9. Trazabilidad

Toda Capability deberá mantener referencias hacia:

- requisitos del producto;
- documentos de arquitectura;
- ADR relacionados;
- Operations;
- Managers;
- pruebas funcionales.

---

# 10. Principio Fundamental

Toda funcionalidad visible para el usuario deberá pertenecer a una única
Capability.

Las Capabilities constituyen el catálogo funcional oficial de
KnowledgeOS.



Es extremadamente limpia.

Cada nivel responde una única pregunta.

| Nivel        | Pregunta                                    |
| ------------ | ------------------------------------------- |
| Constitution | ¿Qué nunca cambia?                        |
| Architecture | ¿Cómo está organizado el sistema?        |
| Capabilities | ¿Qué puede hacer el usuario?              |
| Operations   | ¿Qué caso de uso se ejecuta?              |
| Managers     | ¿Quién conoce las reglas del dominio?     |
| Repositories | ¿Cómo se recuperan y persisten los datos? |
| Storage      | ¿Dónde viven físicamente los datos?      |
