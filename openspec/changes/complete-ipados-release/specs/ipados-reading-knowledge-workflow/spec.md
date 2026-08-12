# iPadOS Reading Knowledge Workflow Specification

## Requirements

### Requirement: Accessible knowledge work
The application MUST support offline reading, annotations, highlights, notes, bookmarks, restoration and portable export while preserving identity. It SHOULD support VoiceOver, Dynamic Type, keyboard, pointer, multitasking and Apple Pencil where applicable. UI code MUST use public contracts and MUST NOT access private repositories.

#### Scenario: Restore reading context
- GIVEN a publication with annotations
- WHEN the application reopens offline
- THEN it SHALL restore valid reading context and Personal Knowledge
- AND it SHALL rebuild invalid derived artifacts safely.

#### Scenario: Accessible annotation
- GIVEN VoiceOver or keyboard input is enabled
- WHEN a reader creates an annotation
- THEN the action and result MUST be accessible
- AND export SHALL preserve its identity and provenance.
