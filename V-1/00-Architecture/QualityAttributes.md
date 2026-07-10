# Quality Attributes

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define los atributos de calidad que guían el diseño, la implementación y la evolución de KnowledgeOS.

Estos atributos tienen la misma importancia que los requisitos funcionales.

Cuando exista conflicto entre funcionalidades y calidad, deberá evaluarse el impacto arquitectónico antes de implementar cambios.

---

# 2. Prioridad

Los atributos de calidad se priorizan en el siguiente orden:

| Prioridad | Atributo                    |
| --------- | --------------------------- |
| 1         | Integridad del conocimiento |
| 2         | Confiabilidad               |
| 3         | Offline First               |
| 4         | Rendimiento                 |
| 5         | Mantenibilidad              |
| 6         | Extensibilidad              |
| 7         | Usabilidad                  |
| 8         | Escalabilidad               |
| 9         | Observabilidad              |
| 10        | Portabilidad                |

---

# 3. Integridad del conocimiento

## Objetivo

El conocimiento nunca debe perderse ni corromperse.

### Escenario

**Fuente**

Usuario.

**Evento**

Importa un libro de 2.000 páginas.

**Respuesta esperada**

El Knowledge Object permanece consistente incluso ante fallos inesperados.

### Medidas

* Todo `.kdoc` es transaccional.
* Todo Asset posee checksum.
* Todo cambio queda registrado.
* Toda corrupción es detectable.

---

# 4. Confiabilidad

## Objetivo

El sistema debe recuperarse automáticamente de errores previsibles.

### Escenario

Durante una sincronización el equipo pierde energía.

### Respuesta esperada

La biblioteca permanece consistente y la sincronización continúa desde el último punto válido.

### Medidas

* Journal.
* WAL.
* Transacciones.
* Reanudación.

---

# 5. Offline First

## Objetivo

Toda funcionalidad esencial debe operar sin Internet.

### Escenario

El usuario trabaja durante varios días sin conexión.

### Respuesta esperada

Puede:

* importar;
* leer;
* anotar;
* buscar;
* organizar;
* exportar.

La sincronización ocurre posteriormente.

---

# 6. Rendimiento

## Objetivo

La biblioteca debe sentirse inmediata.

### Escenarios

Abrir un Knowledge Object.

Objetivo:

< 500 ms para documentos habituales.

---

Buscar texto.

Objetivo:

< 150 ms.

---

Abrir biblioteca.

Objetivo:

< 2 segundos.

---

Cambiar de Renderer.

Objetivo:

< 200 ms.

---

Scroll continuo.

Objetivo:

60 FPS cuando el hardware lo permita.

---

# 7. Escalabilidad

KnowledgeOS debe soportar bibliotecas muy grandes.

Objetivos iniciales.

* 500.000 Knowledge Objects.
* millones de Assets.
* millones de anotaciones.
* cientos de millones de nodos UDM.

La arquitectura no debe requerir rediseños para alcanzar estos valores.

---

# 8. Mantenibilidad

## Objetivo

Agregar funcionalidades nuevas debe requerir modificaciones mínimas.

### Medidas

* Engines independientes.
* Contratos públicos.
* Bajo acoplamiento.
* ADR obligatorios.
* Modular Monolith.

---

# 9. Extensibilidad

## Objetivo

Permitir evolución durante muchos años.

Ejemplos.

* nuevos importadores;
* nuevos renderizadores;
* nuevos modelos IA;
* nuevos plugins.

Sin modificar el núcleo.

---

# 10. Usabilidad

El usuario debe concentrarse en el conocimiento.

No en la herramienta.

Principios.

* interfaz consistente;
* baja carga cognitiva;
* acciones reversibles;
* feedback inmediato;
* navegación fluida.

---

# 11. Portabilidad

El dominio no depende de:

* SwiftUI;
* AppKit;
* UIKit;
* SQLite;
* proveedores IA.

Debe poder reutilizarse en cualquier plataforma.

---

# 12. Observabilidad

Toda operación importante genera información diagnóstica.

Incluye.

* Logs.
* Eventos.
* Métricas.
* Journal.
* Trazas.

Nunca datos sensibles del usuario sin consentimiento.

---

# 13. Seguridad

Objetivos.

* integridad;
* autenticidad;
* confidencialidad cuando corresponda.

El sistema debe minimizar la exposición de información personal.

Las integraciones externas deben requerir autorización explícita.

---

# 14. Recuperabilidad

Ante fallos deberá ser posible:

* reconstruir índices;
* reconstruir el Knowledge Graph;
* reconstruir la caché;
* restaurar backups;
* continuar sincronizaciones.

Nunca perder información persistente.

---

# 15. Compatibilidad

KnowledgeOS deberá mantener compatibilidad entre versiones mediante:

* migraciones;
* versionado del UDM;
* versionado del `.kdoc`;
* versionado de contratos públicos.

---

# 16. Testabilidad

Toda lógica del dominio debe ser comprobable mediante pruebas automatizadas.

El dominio no dependerá de infraestructura para ejecutar pruebas.

---

# 17. Accesibilidad

Las interfaces deberán soportar:

* modo oscuro;
* alto contraste;
* escalado tipográfico;
* navegación mediante teclado;
* VoiceOver;
* Apple Pencil cuando corresponda.

---

# 18. Medición

Cada atributo de calidad deberá contar con métricas verificables durante el desarrollo.

Las regresiones deberán detectarse mediante pruebas automatizadas y herramientas de observabilidad.

---

# 19. Estado

Este documento define los atributos de calidad oficiales de KnowledgeOS.

Todas las decisiones de diseño deberán justificar cómo contribuyen a preservar o mejorar estos atributos.
