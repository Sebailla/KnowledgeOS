#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
C4_DIR="$SCRIPT_DIR/C4"
UML_DIR="$SCRIPT_DIR/UML"
REPORT="$SCRIPT_DIR/DIAGRAM-VALIDATION-REPORT.txt"
RENDERED="$SCRIPT_DIR/rendered"

fail() {
  printf 'ERROR: %s\n' "$1" >&2
  exit 1
}

command -v java >/dev/null 2>&1 || fail "Java is not installed or not available in PATH."
command -v dot >/dev/null 2>&1 || fail "Graphviz 'dot' is not installed or not available in PATH."
command -v plantuml >/dev/null 2>&1 || fail "PlantUML is not installed or not available in PATH."

mapfile_compatible=false
if command -v mapfile >/dev/null 2>&1; then
  mapfile_compatible=true
fi

files=()
while IFS= read -r -d '' file; do
  files+=("$file")
done < <(find "$C4_DIR" "$UML_DIR" -type f -name '*.puml' -print0 | sort -z)

[[ ${#files[@]} -gt 0 ]] || fail "No .puml files were found."

rm -rf "$RENDERED"
mkdir -p "$RENDERED/C4" "$RENDERED/UML"

{
  echo "KnowledgeOS Architecture V3 — Diagram Validation"
  echo "Date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo
  echo "Java:"
  java -version 2>&1
  echo
  echo "Graphviz:"
  dot -V 2>&1
  echo
  echo "PlantUML:"
  plantuml -version 2>&1
  echo
  echo "Sources: ${#files[@]}"
  echo
} > "$REPORT"

for file in "${files[@]}"; do
  relative="${file#"$SCRIPT_DIR"/}"
  echo "Checking $relative"
  plantuml -checkonly "$file" >> "$REPORT" 2>&1

  case "$relative" in
    C4/*)
      output_dir="$RENDERED/C4"
      ;;
    UML/*)
      output_dir="$RENDERED/UML"
      ;;
    *)
      output_dir="$RENDERED"
      ;;
  esac

  plantuml -tsvg -o "$output_dir" "$file" >> "$REPORT" 2>&1
  echo "PASS: $relative" >> "$REPORT"
done

expected=${#files[@]}
rendered_count=$(find "$RENDERED" -type f -name '*.svg' | wc -l | tr -d ' ')

{
  echo
  echo "Expected SVG files: $expected"
  echo "Generated SVG files: $rendered_count"
} >> "$REPORT"

[[ "$rendered_count" -eq "$expected" ]] || fail "Expected $expected SVG files but generated $rendered_count. Review $REPORT."

echo
echo "All $expected PlantUML diagrams compiled successfully."
echo "Report: $REPORT"
echo "Rendered SVG: $RENDERED"
