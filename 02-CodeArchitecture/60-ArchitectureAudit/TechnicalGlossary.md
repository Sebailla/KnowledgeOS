# Technical Glossary

**Project:** KnowledgeOS  
**Section:** 02-CodeArchitecture  
**Version:** 5.6.5  
**Status:** Approved  

## ADR

Architecture Decision Record used to capture a durable architectural decision and its rationale.

## Backpressure

Flow-control mechanism preventing producers from overwhelming consumers.

## Circuit Breaker

Resilience mechanism that temporarily blocks failing downstream operations.

## Contract

Stable interface boundary between subsystems or implementation layers.

## Cursor

Monotonic synchronization position for a replica pair.

## DPM

Document Presentation Model: spatial and visual representation of document layout.

## Determinism

Property that identical inputs and state produce identical outputs and ordering.

## Engine

Autonomous platform subsystem with explicit contracts, runtime lifecycle, persistence boundaries, and quality requirements.

## Idempotency

Property that repeating the same operation does not change the result after the first successful application.

## Journal

Append-only event history used for audit, sync, and recovery.

## Kernel

Minimal execution core that coordinates commands, queries, events, configuration, jobs, and cross-cutting runtime services.

## Library

Logical owner-scoped model of knowledge objects, relationships, versions, events, snapshots, and metadata.

## Local Library

Offline-first client-side library cache and runtime state.

## Master Library

Authoritative NAS-hosted library state and storage services.

## Offline First

Operating model in which local work remains available without network connectivity and later reconciles with authoritative state.

## PKG

Personal Knowledge Graph: owner-specific graph of interests, skills, memories, goals, and context.

## Projection

Derived representation built from authoritative state for search, graph, analytics, or presentation.

## Provenance

Recorded origin, source, transformation, and evidence for a piece of knowledge or derived fact.

## Runtime

Executable orchestration layer that binds contracts, repositories, policies, and lifecycle management.

## Snapshot

Point-in-time capture used to accelerate startup, recovery, and synchronization.

## Source of Truth

Authoritative state from which replicas and derived indexes may be rebuilt.

## UDM

Universal Document Model: canonical semantic representation of document content.
