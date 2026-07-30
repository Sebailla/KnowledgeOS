
# Color Model

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Color Model

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Color Model of the Document Presentation Model (DPM).

The Color Model represents semantic color intent rather than concrete color values.

It enables consistent presentation across themes, devices and rendering technologies while preserving editorial identity.

---

# 2. Scope

The Color Model defines:

* semantic color roles;
* color hierarchy;
* emphasis;
* contrast intent;
* accessibility intent;
* color adaptation.

It does not define concrete color values.

---

# 3. Design Goals

The Color Model shall:

* preserve presentation intent;
* remain renderer-independent;
* remain device-independent;
* support adaptive themes;
* support accessibility;
* remain deterministic.

---

# 4. Design Philosophy

The DPM expresses **why** a color is used.

Themes determine **which** color is rendered.

Concrete color values belong to Themes.

Semantic color roles belong to the DPM.

---

# 5. Conceptual Model

```text
Presentation Element
        │
        ▼
Semantic Color Role
        │
        ▼
Theme Mapping
        │
        ▼
Rendered Color
```

The DPM never stores rendered colors.

---

# 6. Semantic Color Roles

The DPM defines the following core semantic roles.

### Text

* Primary Text
* Secondary Text
* Tertiary Text
* Disabled Text
* Inverse Text

### Background

* Primary Background
* Secondary Background
* Surface
* Elevated Surface

### Accent

* Primary Accent
* Secondary Accent
* Highlight
* Chapter Accent
* Quote Accent
* Reference Accent

### Feedback

* Success
* Warning
* Error
* Information

### Structural

* Border
* Divider
* Separator
* Decoration

Extensions may introduce additional semantic roles.

---

# 7. Color Intent

Every semantic role expresses presentation intent.

Examples include:

* emphasis;
* separation;
* orientation;
* navigation;
* grouping;
* decoration.

Intent is independent of chromatic implementation.

---

# 8. Contrast Intent

The DPM specifies required contrast behavior.

Typical contrast levels include:

* Maximum
* High
* Medium
* Low
* Decorative

Themes are responsible for satisfying the required contrast.

---

# 9. Accessibility

The Color Model supports:

* high-contrast rendering;
* monochrome rendering;
* color-blind adaptations;
* low-vision themes;
* grayscale rendering.

Semantic intent remains unchanged.

---

# 10. Theme Independence

The same semantic role may be rendered differently in:

* Light Theme;
* Dark Theme;
* Sepia Theme;
* E-Ink Theme;
* High Contrast Theme;
* Print Theme.

The DPM remains identical.

---

# 11. Color Independence

The DPM shall not contain:

* RGB values;
* HEX values;
* CMYK values;
* HSL values;
* OKLCH values;
* platform-specific color objects.

Those belong exclusively to Theme implementations.

---

# 12. Relationship to Typography

Typography and Color cooperate to communicate emphasis.

Neither determines hierarchy independently.

---

# 13. Relationship to Visual Hierarchy

Color reinforces Visual Hierarchy.

Hierarchy shall remain understandable even when rendered in monochrome.

---

# 14. Relationship to Decorations

Decorations may reference semantic color roles.

Decoration appearance is resolved through Themes.

---

# 15. Relationship to Themes

Themes map semantic roles to concrete color definitions.

Theme implementations may use:

* OKLCH;
* RGB;
* Display P3;
* CMYK;
* future color spaces.

The Color Model remains independent of the underlying color space.

---

# 16. Validation

A valid Color Model shall satisfy:

* registered semantic role;
* valid contrast intent;
* compatible Presentation Type;
* deterministic mapping.

---

# 17. Invariants

The following invariants apply:

* the DPM stores semantic color intent only;
* concrete colors belong to Themes;
* color roles are deterministic;
* accessibility adaptations preserve semantic intent;
* hierarchy shall never depend solely on color.

---

# 18. Related Documents

* Typography.md
* VisualHierarchy.md
* Decorations.md
* Themes.md
* ../Core/PresentationAttributes.md

---

# 19. Status

**Approved**

This document defines the Color Model of the Document Presentation Model.

The DPM represents semantic color intent rather than concrete color values, ensuring long-term portability, accessibility and consistent presentation across themes, rendering technologies and future platforms.
