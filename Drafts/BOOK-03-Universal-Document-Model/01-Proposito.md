
# 1. Propósito

El Universal Document Model tiene como propósito proporcionar una representación uniforme para cualquier documento incorporado a KnowledgeOS.

El UDM elimina la dependencia entre las funcionalidades de la aplicación y los formatos de archivo existentes.

Toda funcionalidad desarrollada para KnowledgeOS deberá operar sobre el UDM.

Esto garantiza que las capacidades del sistema sean independientes de:

- PDF;
- EPUB;
- Markdown;
- CHM;
- HTML;
- DOCX;
- TXT;
- imágenes escaneadas;
- futuros formatos.

Como consecuencia, la incorporación de un nuevo formato únicamente requerirá desarrollar un nuevo importador.

Ningún otro componente del sistema deberá modificarse.

Este principio constituye uno de los pilares fundamentales de la arquitectura de KnowledgeOS.
