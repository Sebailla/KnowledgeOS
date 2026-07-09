
# Component – Knowledge Core

## Objetivo

Describir la organización modular del Knowledge Core como conjunto de componentes internos.

---

## Componentes

- Application Layer
- Import Engine
- Library Engine
- Search Engine
- Render Engine
- Annotation Engine
- AI Engine
- Sync Engine
- Export Engine
- Plugin Engine
- Event Bus
- Shared Kernel
- Infrastructure Ports

---

## Regla

Los Engines no se comunican directamente entre sí.

Toda comunicación ocurre mediante contratos públicos o eventos.
