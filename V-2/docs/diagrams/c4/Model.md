
# C4 Modeling Guidelines

Version: 1.0
Status: Approved

---

# Purpose

This document defines how the C4 Model is applied within KnowledgeOS.

It establishes a consistent modeling strategy for all C4 diagrams.

These rules are mandatory.

---

# Design Principles

- Simplicity over completeness.
- One responsibility per element.
- Stable abstractions.
- Technology independent.
- Progressive refinement.

Each C4 level must reveal additional information without contradicting previous levels.

---

# C4 Levels

## Level 1

System Context

Shows:

- People
- KnowledgeOS Platform
- External Systems

Does not show:

- Containers
- Components
- Databases
- Technologies
- Internal modules

---

## Level 2

Container Diagram

Shows:

- Applications
- Executables
- Services
- Desktop application
- CLI
- Background services

Does not show:

- Classes
- Engines
- Internal architecture

---

## Level 3

Component Diagram

Shows:

- Kernel
- Platform
- Engines
- Shared Services

Does not show:

- Classes
- Methods
- Internal algorithms

---

## Level 4

Not used.

Detailed implementation is documented using UML.

---

# People

A Person represents a human interacting with KnowledgeOS.

Examples:

- User
- Plugin Developer

A Person must never represent software.

---

# System

A System represents KnowledgeOS as a whole.

Only one System exists.

Name:

KnowledgeOS Platform

---

# External System

Represents any software or service outside KnowledgeOS.

Examples:

- File System
- Git Repository
- Cloud Storage
- AI Providers
- External Knowledge Sources

External systems are black boxes.

Their internal implementation is never modeled.

---

# Container

Represents an executable runtime boundary.

Examples:

- Desktop Application
- CLI
- Background Worker
- Sync Service

Containers communicate using public interfaces.

---

# Component

Represents a logical subsystem.

Examples:

- Kernel
- Platform
- Import Engine
- Storage Engine
- Search Engine
- Knowledge Engine

Components never represent classes.

---

# Relationships

Relationships describe dependencies.

Every relationship must have:

- Direction
- Purpose
- Short description

Example:

User
uses
KnowledgeOS Platform

---

# Technology

Technology names should only appear when they are architecturally significant.

Avoid:

React

SQLite

OpenAI

Prefer:

Desktop UI

Database

AI Provider

Technology decisions belong to Architecture documentation.

---

# Naming Rules

Use singular names.

Correct:

Knowledge Engine

Incorrect:

Knowledge Engines

---

Use nouns.

Avoid verbs.

Correct:

Storage Engine

Incorrect:

Stores Data

---

# Diagram Size

Maximum:

15 elements

If a diagram exceeds this limit, create another diagram.

---

# Layout

Preferred direction:

Left → Right

Use vertical layouts only when they improve readability.

---

# Colors

Colors are defined exclusively in:

styles/

No diagram may define custom colors.

---

# Source of Truth

The .puml files are the canonical representation.

Markdown documents explain the architecture.

Both must remain synchronized.

---
