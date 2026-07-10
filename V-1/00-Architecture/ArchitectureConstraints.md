
# Architecture Constraints

**Proyecto:** KnowledgeOS

**Versión:** 2.0

**Estado:** Congelado

---

# 1. Objetivo

Este documento define las restricciones arquitectónicas obligatorias de KnowledgeOS.

Las restricciones establecen los límites dentro de los cuales debe evolucionar el sistema.

No son recomendaciones.

Son reglas obligatorias.

Toda excepción deberá aprobarse mediante un Architecture Decision Record (ADR).

---

# 2. Restricciones del Dominio

## AC-01 — El dominio es independiente

El dominio nunca dependerá de:

* SQLite
* SwiftData
* Core Data
* PostgreSQL
* Redis
* REST
* GraphQL
* HTTP
* archivos
* frameworks UI

---

## AC-02 — El dominio no conoce plataformas

El dominio nunca contendrá referencias específicas a:

* macOS
* iOS
* iPadOS
* Web

---

## AC-03 — El dominio no conoce proveedores

El dominio nunca conocerá:

* OpenAI
* Anthropic
* Gemini
* Ollama
* LM Studio
* cualquier proveedor de IA

Todos los proveedores pertenecen a Infrastructure.

---

# 3. Restricciones del Modelo

## AC-04 — El Knowledge Object es inmutable como concepto

Todo elemento persistente del sistema es un Knowledge Object.

No existirán modelos persistentes paralelos.

---

## AC-05 — Un único UDM

Cada Knowledge Object posee exactamente un UDM.

---

## AC-06 — El UDM es la fuente de verdad

El contenido únicamente puede modificarse mediante el UDM.

---

## AC-07 — El Knowledge Graph nunca reemplaza al UDM

El Knowledge Graph siempre es derivado.

Puede eliminarse y reconstruirse completamente.

---

## AC-08 — Los Assets son externos

Los Assets nunca forman parte física del archivo `.kdoc`.

---

## AC-09 — Los originales son inmutables

KnowledgeOS nunca modifica el archivo original importado.

---

# 4. Restricciones de Persistencia

## AC-10 — Formato nativo

Todo Knowledge Object persistente se almacena como un archivo `.kdoc`.

---

## AC-11 — Persistencia transaccional

Toda operación persistente debe ejecutarse mediante transacciones.

---

## AC-12 — Integridad verificable

Todo recurso persistente debe poder verificarse mediante checksum.

---

## AC-13 — Versionado permanente

Toda modificación persistente debe generar una nueva versión lógica.

Nunca se sobrescribe información crítica.

---

## AC-14 — Journal obligatorio

Toda operación persistente debe registrarse en el Journal.

---

# 5. Restricciones de Arquitectura

## AC-15 — Modular Monolith

La implementación inicial será un Modular Monolith.

No se introducirán microservicios.

---

## AC-16 — Comunicación desacoplada

Los Engines nunca se comunicarán mediante llamadas directas a implementaciones internas.

La comunicación se realizará únicamente mediante:

* Commands
* Queries
* Events

---

## AC-17 — Sin dependencias circulares

No se permiten dependencias circulares entre módulos.

---

## AC-18 — Un Engine, una responsabilidad

Cada Engine posee una única responsabilidad principal.

---

## AC-19 — APIs públicas

Todo acceso entre módulos utilizará contratos públicos.

---

# 6. Restricciones de Sincronización

## AC-20 — Offline First

Toda funcionalidad esencial debe operar sin conexión.

---

## AC-21 — Source of Truth única

Cada Library posee una única Source of Truth.

---

## AC-22 — Sincronización incremental

No se permiten sincronizaciones completas como mecanismo habitual.

---

## AC-23 — Reanudación

Toda sincronización interrumpida debe poder reanudarse.

---

# 7. Restricciones de IA

## AC-24 — IA opcional

KnowledgeOS debe funcionar completamente sin IA.

---

## AC-25 — IA no destructiva

La IA nunca modifica automáticamente el contenido del UDM.

---

## AC-26 — Proveedores intercambiables

Ningún proveedor de IA puede convertirse en dependencia arquitectónica.

---

## AC-27 — Resultados trazables

Todo resultado generado por IA debe registrar:

* proveedor;
* modelo;
* versión;
* fecha;
* parámetros relevantes.

---

# 8. Restricciones de Plugins

## AC-28 — Sin acceso interno

Los Plugins nunca accederán directamente a implementaciones internas.

---

## AC-29 — Permisos explícitos

Todo Plugin declara los permisos que requiere.

---

## AC-30 — Compatibilidad

Todo Plugin declara la versión mínima y máxima compatible.

---

# 9. Restricciones de Calidad

## AC-31 — Sin duplicación de conocimiento

No debe existir más de una representación canónica del mismo contenido.

---

## AC-32 — Trazabilidad

Toda operación importante debe poder reconstruirse.

---

## AC-33 — Recuperabilidad

Toda corrupción detectada debe poder recuperarse o aislarse.

---

## AC-34 — Observabilidad

Toda operación relevante debe generar información suficiente para diagnóstico.

---

## AC-35 — Determinismo

El mismo proceso, ejecutado con la misma entrada, debe producir el mismo resultado salvo cuando intervengan explícitamente componentes probabilísticos (por ejemplo, modelos de IA).

---

# 10. Restricciones de Evolución

## AC-36 — Cambios mediante ADR

Toda modificación arquitectónica significativa requiere un ADR.

---

## AC-37 — Compatibilidad

Las nuevas versiones deberán incluir una estrategia de migración cuando afecten al formato `.kdoc` o al UDM.

---

## AC-38 — Congelamiento del núcleo

Los conceptos fundamentales:

* Knowledge Object
* `.kdoc`
* UDM
* Knowledge Graph
* Engine Architecture

no podrán modificarse sin una revisión arquitectónica mayor.

---

# 11. Lista de Prohibiciones

Está expresamente prohibido:

* modificar archivos originales;
* acoplar el dominio a una tecnología;
* almacenar Assets dentro del `.kdoc`;
* introducir dependencias circulares;
* acceder a implementaciones internas de otro Engine;
* crear nuevos formatos persistentes sin ADR;
* duplicar información canónica;
* utilizar la IA para modificar automáticamente el contenido del usuario;
* introducir microservicios durante la fase inicial del proyecto.

---

# 12. Estado

Este documento define las restricciones arquitectónicas oficiales de KnowledgeOS.

El incumplimiento de cualquiera de estas restricciones constituye una desviación arquitectónica y deberá justificarse formalmente mediante un Architecture Decision Record.
