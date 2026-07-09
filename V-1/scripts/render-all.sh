#!/bin/bash

ROOT=$(pwd)

find docs/00-Architecture/C4/diagrams \
-name "*.puml" \
-exec plantuml \
-tsvg \
-o "$ROOT/docs/00-Architecture/C4/generated/svg" \
{} \;

find docs/00-Architecture/C4/diagrams \
-name "*.puml" \
-exec plantuml \
-tpng \
-o "$ROOT/docs/00-Architecture/C4/generated/png" \
{} \;

echo "✔ Todos los diagramas fueron generados."