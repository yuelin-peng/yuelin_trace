<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (new constitution)
- Added principles: I. Systemic over Individual, II. Accessibility by Default, III. Predictability, IV. Composition over Configuration, V. Design Tokens & Theming
- Added sections: Technical Standards, Quality Assurance, Contribution Workflow, Governance
- Templates requiring updates: ✅ plan-template.md (Constitution Check section aligned), ✅ spec-template.md (aligned), ✅ tasks-template.md (aligned)
- No follow-up TODOs
-->
# Spec-Kit Constitution
<!-- Single Source of Truth for visual and functional language -->

## Core Principles

### I. Systemic over Individual
We solve for the system, not for isolated edge cases. Every component must be generic enough to serve multiple contexts. Solutions are designed for broad reusability rather than one-off needs.

### II. Accessibility by Default
No component is considered "Done" unless it meets WCAG 2.1 Level AA standards. Accessibility is a non-negotiable requirement, not an afterthought.

### III. Predictability
Components must behave consistently across the entire ecosystem. Props naming, event handling, and state management should follow established patterns. Users should feel at home across all touchpoints.

### IV. Composition over Configuration
We prefer small, composable sub-components (e.g., Dialog.Header, Dialog.Footer) over monolithic components with excessive props. Building blocks over big-bang components.

### V. Design Tokens & Theming
All visual values must be abstracted into Design Tokens. Hardcoding hex codes, pixel values, or easing functions in component logic is strictly prohibited. Token Tiers: Tier 1 (Global), Tier 2 (Alias/Semantic), Tier 3 (Component-Specific).

## Technical Standards

Framework: Built on React/Next.js (or relevant framework) using TypeScript for strict type safety.

Styling: Utility-first CSS (Tailwind) or CSS-in-JS with a strict theme-provider dependency.

Prop Naming Conventions:
- Boolean props MUST use prefixes: isDisabled, isLoading, hasIcon
- Event handlers MUST use the on prefix: onClick, onChange

Zero Dependencies: Core components should avoid heavy third-party libraries to keep the bundle size minimal.

## Quality Assurance

A component is considered production-ready only when it includes:

Visual States: Default, Hover, Active, Focus, Disabled, and Loading states.

Responsiveness: Verified behavior across Mobile, Tablet, and Desktop breakpoints.

Documentation: Clear API table, usage guidelines (Do's and Don'ts), and interactive examples.

Tests: Unit tests for logic and Snapshot tests for UI regressions.

## Contribution Workflow

To maintain the integrity of the Spec-Kit, all changes must follow the RFC (Request for Comments) process:

Proposal: Submit an issue detailing the need for a new component or a breaking change.

Design Audit: Ensure the visual satisfies the design system's language in Figma.

Development: Build the component in a feature branch with 100% Storybook coverage.

Peer Review: Requires approval from at least one Design Steward and one Lead Engineer.

Versioning: We strictly adhere to Semantic Versioning (SemVer).

## Governance

The Council: A cross-functional group of designers and engineers who meet bi-weekly to review RFCs and resolve conflicts.

Deprecation: When a component is replaced, it enters a "Deprecated" state for two minor releases before being removed in the next major release.

Amendment Procedure: All changes follow the RFC process. Major changes require approval from The Council.

**Version**: 1.0.0 | **Ratified**: 2026-05-03 | **Last Amended**: 2026-05-03