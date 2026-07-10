
# ADR-002 — Universal Document Model (UDM)

**Proyecto:** KnowledgeOS

**Documento:** Architecture Decision Record

**Versión:** 2.0

**Estado:** Accepted

**Autor:** KnowledgeOS Team

**Última actualización:** *(Completar)*

**Supersedes**

* ADR-002 v1.0

**Related Documents**

* ../ArchitectureModel.md
* ../DomainModel.md
* ../ProductVision.md
* ../ArchitectureVocabulary.md
* ../../01-Specifications/UDM/UDM.md

---

# 1. Context

KnowledgeOS importa conocimiento desde múltiples fuentes:

* PDF
* EPUB
* DOCX
* HTML
* Markdown
* CHM
* TXT
* Imágenes mediante OCR
* Fuentes futuras

Cada formato utiliza un modelo interno diferente para representar:

* estructura;
* estilo;
* disposición;
* metadatos;
* referencias.

Diseñar la plataforma alrededor de cualquiera de estos formatos introduciría dependencias permanentes y limitaría la evolución del sistema.

Era necesario definir una representación única, independiente del origen y estable en el tiempo.

---

# 2. Decisión

KnowledgeOS adopta el **Universal Document Model (UDM)** como representación canónica del contenido estructurado de todo **Knowledge Object**.

El UDM constituye la única fuente de verdad del contenido.

Todos los procesos posteriores consumen el UDM.

```text
Physical Source
        │
        ▼
Import Pipeline
        │
        ▼
Universal Document Model
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Render  Search     Knowledge
        │               │
        ▼               ▼
      Export      Knowledge Graph
```

---

# 3. Motivación

El UDM permite:

* independencia de formatos;
* representación uniforme;
* renderizadores múltiples;
* anotaciones persistentes;
* búsqueda estructural;
* enriquecimiento mediante IA;
* evolución controlada.

El contenido deja de depender del archivo original.

---

# 4. Detailed Design

## Naturaleza

El UDM representa únicamente el contenido.

No representa:

* persistencia;
* sincronización;
* almacenamiento;
* interfaz;
* ventanas;
* preferencias.

Estas responsabilidades pertenecen a otros componentes del sistema.

---

## Relación con Knowledge Object

Todo Knowledge Object contiene exactamente un UDM.

```text
Knowledge Object
│
├── Identity
├── Metadata
├── UDM
├── Layout
├── Style
├── Knowledge
├── Provenance
├── History
└── Assets
```

El UDM constituye una parte del Knowledge Object.

No lo reemplaza.

---

## Organización

El UDM se organiza como un árbol jerárquico de nodos.

```text
Document
│
├── Chapter
│
├── Section
│
├── Paragraph
│
├── Table
│
├── Figure
│
└── Code Block
```

Cada nodo posee identidad permanente.

---

## Identidad

Todo nodo posee:

* NodeID;
* ParentNodeID;
* NodeType;
* Version;
* CreatedAt;
* UpdatedAt.

La identidad permanece estable durante toda la vida del Knowledge Object.

---

## Capas

El UDM separa claramente:

```text
Content
│
├── Structure
├── Layout
├── Style
└── Semantic References
```

Cada capa puede evolucionar independientemente.

---

## Anchors

Las anotaciones nunca dependen únicamente de coordenadas.

Toda anotación referencia un Anchor.

Un Anchor apunta a uno o más NodeID.

Esto permite conservar anotaciones incluso cuando cambia la representación visual.

---

## Layout

Describe la organización física del contenido original.

Incluye:

* páginas;
* columnas;
* regiones;
* coordenadas;
* orden de lectura.

El Layout puede ignorarse durante determinados renderizados.

---

## Style

Describe propiedades visuales.

Ejemplos:

* tipografía;
* colores;
* alineación;
* espaciado;
* márgenes.

El Style nunca modifica el contenido.

---

## Assets

El UDM referencia Assets.

Nunca los almacena físicamente.

---

## Knowledge References

El UDM puede contener referencias hacia:

* entidades;
* conceptos;
* relaciones;
* anotaciones.

El conocimiento derivado permanece desacoplado del contenido.

---

# 5. Principios

El UDM cumple los siguientes principios:

1. Un único UDM por Knowledge Object.
2. Fuente de verdad del contenido.
3. Independencia del formato de origen.
4. Independencia del renderizador.
5. Independencia del almacenamiento.
6. Identidades permanentes.
7. Contenido desacoplado de la presentación.
8. Capacidad de evolución mediante versionado.

---

# 6. Beneficios

* Representación uniforme.
* Conversión entre formatos.
* Renderizadores múltiples.
* Persistencia estable.
* Anotaciones robustas.
* Búsqueda estructural.
* IA desacoplada.
* Compatibilidad futura.

---

# 7. Alternativas consideradas

## PDF como modelo interno

Descartado.

Representa presentación, no contenido.

---

## Markdown

Descartado.

No expresa adecuadamente tablas complejas, layout ni semántica.

---

## HTML

Descartado.

Combina estructura y presentación.

---

## DOM

Descartado.

Depende del ecosistema web.

---

## AST específico por formato

Descartado.

Generaría múltiples modelos internos incompatibles.

---

# 8. Consecuencias

## Positivas

* Independencia tecnológica.
* Conversión uniforme.
* Mayor mantenibilidad.
* Reutilización de renderizadores.
* Integración sencilla con IA.
* Evolución controlada.

## Negativas

* Importadores más complejos.
* Necesidad de mapear múltiples formatos.
* Curva de aprendizaje inicial.

---

# 9. Trade-offs

Se prioriza:

* fidelidad semántica sobre fidelidad visual absoluta;
* estabilidad del contenido sobre simplicidad de implementación;
* independencia de formatos sobre optimizaciones específicas.

---

# 10. Riesgos

## Pérdida de información durante la importación

Mitigación:

* Layout separado;
* Provenance;
* Confidence Model.

---

## Evolución del modelo

Mitigación:

* Versionado del UDM;
* Migraciones;
* Validación.

---

## Nuevos formatos

Mitigación:

* Import Pipeline desacoplado;
* Builders independientes.

---

# 11. Related Documents

* ProductVision.md
* DomainModel.md
* KnowledgeLifecycle.md
* ArchitectureVocabulary.md
* UDM.md
* NodeTypes.md
* TypeSystem.md
* Serialization.md
* ValidationRules.md

---

# 12. Related ADR

* ADR-001 — Architectural Style
* ADR-004 — Library Source of Truth
* ADR-008 — Storage Architecture
* ADR-010 — Knowledge Object Identity
* ADR-013 — Knowledge Object Architecture
* ADR-015 — Global Identity Model

---

# 13. Status

**Accepted**

El Universal Document Model constituye la representación canónica del contenido de todo Knowledge Object dentro de KnowledgeOS.

Toda funcionalidad que procese contenido deberá consumir o producir un UDM válido.

Ningún componente podrá utilizar un formato de origen como modelo interno del sistema.
