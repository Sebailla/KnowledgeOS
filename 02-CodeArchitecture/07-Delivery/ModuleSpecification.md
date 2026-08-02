        # Entrega incremental — Module Specification

        **Project:** KnowledgeOS  
        **Section:** `02-CodeArchitecture/07-Delivery`  
        **Version:** 5.6.1  
        **Status:** Approved for implementation alignment  
        **Last updated:** 2026-08-02

        ## 1. Mission

        Define bootstrap, trazabilidad y estrategia de vertical slices para entregar capacidades completas sin romper límites.

        Esta especificación gobierna los documentos del directorio y define el mínimo que debe conservar cualquier implementación futura.

        ## 2. Architectural invariants

        1. La dirección de dependencias siempre apunta hacia contratos más estables.
        2. El dominio no importa frameworks, drivers ni protocolos.
        3. La identidad autenticada no se obtiene de payloads controlados por consumidores.
        4. Los efectos repetibles requieren idempotencia y trazabilidad.
        5. El estado derivado debe poder reconstruirse desde estado autoritativo.
        6. Cada contrato público posee versión y pruebas de conformidad.
        7. Los fallos se clasifican y no se convierten en excepciones genéricas sin contexto.
        8. La observabilidad preserva correlación y privacidad.

        ## 3. Package mapping

        | Package | Role |
        |---|---|
        | `packages/tooling` | Implementación o contratos asociados a Entrega incremental. |
| `packages/testing` | Implementación o contratos asociados a Entrega incremental. |

        ## 4. Entry and exit criteria

        Un cambio entra al módulo mediante un contrato conocido, contexto autenticado y configuración validada. Sale como resultado tipado, evento confirmado o error clasificado. Ningún efecto externo se considera confirmado antes de que la política transaccional lo permita.

        ## 5. Quality gates

        - TypeScript estricto o compilación Swift sin advertencias críticas.
        - Pruebas unitarias, contractuales y de integración según el riesgo.
        - Sin ciclos ni dependencias prohibidas.
        - Sin placeholders documentales.
        - Diagramas y referencias internas resolubles.
        - Evidencia de migración para cambios persistentes.

        ## 6. Operational model

        El módulo debe iniciar de manera determinista, exponer readiness solo después de validar dependencias necesarias y apagarse drenando trabajo en curso. Los presupuestos de tiempo, reintentos y límites se configuran en el host, no dentro del dominio.

        ## 7. Change control

        Toda modificación que cambie una invariante, un contrato público, un formato persistente o una dirección de dependencia requiere ADR y actualización coordinada de documentación, código y pruebas.
