# Implementation Governance

**Project:** KnowledgeOS  
**Section:** Implementation / Governance  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document defines how KnowledgeOS moves from approved architecture to production implementation.

Implementation Governance protects architectural decisions while allowing teams and agents to choose appropriate technologies, code organization and delivery practices.

## 2. Scope

This governance applies to:

- Master Library;
- desktop application;
- future mobile applications;
- optional web application;
- shared libraries;
- infrastructure;
- migrations;
- tests;
- deployment;
- operations;
- implementation documentation;
- coding agents.

## 3. Governing Rule

Implementation SHALL conform to `00-Architecture`.

When implementation convenience conflicts with accepted architecture, architecture prevails unless an ADR explicitly changes the architecture.

Implementation documents MAY refine:

- concrete technology;
- package structure;
- database schema;
- API representation;
- deployment detail;
- coding conventions;
- test strategy.

They SHALL NOT redefine:

- identity;
- authority;
- Master/Local Library separation;
- acquisition;
- Personal Knowledge synchronization;
- UDM;
- DPM;
- Engine ownership;
- Kernel guarantees.

## 4. Implementation Sequence

The recommended implementation order is:

1. Implementation Governance;
2. Master Library;
3. shared contracts and generated clients;
4. desktop Local Library;
5. import and acquisition;
6. canonical processing;
7. reading and rendering;
8. annotation;
9. personal synchronization;
10. search;
11. AI;
12. plugins;
13. mobile clients;
14. optional web client.

Each stage SHALL establish its contracts, tests and operational requirements before depending modules are considered complete.

## 5. Traceability

Every implementation module SHALL identify:

- architecture documents implemented;
- ADRs applied;
- public contracts exposed;
- invariants protected;
- tests proving conformance;
- migrations required;
- operational responsibilities;
- known limitations.

## 6. Required Artifacts

Each implementation module SHOULD contain:

- charter or README;
- requirements;
- technical design;
- domain mapping;
- public contracts;
- persistence design;
- implementation design;
- test strategy;
- operations;
- completion checklist;
- traceability matrix.

## 7. Change Control

An implementation change requires architectural review when it:

- changes authority;
- changes identity;
- combines acquisition and synchronization;
- places Personal Knowledge in the Master Library;
- introduces a new Engine;
- bypasses a public contract;
- exposes a private repository;
- changes delivery or transaction guarantees;
- introduces an incompatible public API;
- changes storage ownership.

## 8. Quality Gates

A module SHALL NOT be considered complete until:

- requirements are accepted;
- contracts are versioned;
- architecture compliance is reviewed;
- critical tests pass;
- migrations are reversible or recoverable;
- observability exists;
- security and privacy have been evaluated;
- operational runbooks exist where required;
- Definition of Done is satisfied.

## 9. Status

This README is the rector document for KnowledgeOS Implementation Governance V4.
