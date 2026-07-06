
# Universal Document Model (UDM)

## Propósito

El Universal Document Model (UDM) define la representación interna única utilizada por KnowledgeOS.

Todo documento importado por la plataforma será convertido al UDM.

A partir de ese momento, ninguna funcionalidad del sistema trabajará directamente sobre el archivo original.

El archivo original será preservado únicamente como referencia y para procesos de auditoría, reimportación o verificación.

El UDM constituye la única fuente de verdad para:

- renderizado;
- anotaciones;
- búsqueda;
- inteligencia artificial;
- sincronización;
- exportación;
- versionado;
- navegación;
- relaciones entre documentos.

Todo componente del sistema deberá consumir el UDM.

Ningún componente podrá acceder directamente al archivo de origen.

---

## Objetivos

El UDM deberá cumplir los siguientes objetivos.

### UDM-G001

Representar cualquier tipo de documento.

### UDM-G002

Ser independiente del formato de origen.

### UDM-G003

Ser independiente del motor de renderizado.

### UDM-G004

Permitir múltiples representaciones visuales del mismo contenido.

### UDM-G005

Mantener la estabilidad de las anotaciones.

### UDM-G006

Preservar la máxima cantidad posible de información del documento original.

### UDM-G007

Permitir la evolución futura sin romper compatibilidad.

### UDM-G008

Servir como modelo común para todos los motores de IA.

---

## No Objetivos

El UDM no es:

- un formato de almacenamiento;
- una base de datos;
- un formato de intercambio;
- un motor de renderizado;
- un motor OCR;
- un editor Markdown.

El UDM es exclusivamente un modelo conceptual y lógico.

La implementación física queda fuera del alcance de esta especificación.

---

## Principio Fundamental

Todo elemento persistente dentro de KnowledgeOS será representado mediante un objeto definido por el Universal Document Model.

No existen excepciones.

---

## Definición de Documento

Dentro de KnowledgeOS, un documento es una colección organizada de objetos del UDM.

Un documento deja de ser considerado un archivo.

Pasa a ser un grafo estructurado de objetos relacionados entre sí.

Esta definición es normativa.
