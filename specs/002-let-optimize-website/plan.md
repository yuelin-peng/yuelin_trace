# Implementation Plan: Website Visual Optimization

**Branch**: `002-let-optimize-website` | **Date**: 2026-05-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-let-optimize-website/spec.md`

## Summary

Complete visual redesign of the public-facing website using a modern design system built on React/Next.js with TypeScript. The redesign incorporates sophisticated motion design (scroll-triggered animations, parallax, page transitions), meets WCAG 2.1 Level AA accessibility standards, and achieves Google "good" Core Web Vitals thresholds (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+, Next.js 14+ (App Router)  
**Primary Dependencies**: React, Next.js, Tailwind CSS, Framer Motion, clsx, tailwind-merge  
**Storage**: N/A (static site generation with optional CMS integration)  
**Testing**: Jest, React Testing Library, Playwright (E2E), Lighthouse CI  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: web-application  
**Performance Goals**: Core Web Vitals - LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1  
**Constraints**: WCAG 2.1 AA compliance, design tokens only (no hardcoded values), reduced motion support  
**Scale/Scope**: All public-facing pages, responsive 320px-2560px

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Systemic over Individual | PASS | Design system approach with reusable components |
| II. Accessibility by Default | PASS | WCAG 2.1 AA required by spec (FR-012) |
| III. Predictability | PASS | Consistent component APIs via design tokens |
| IV. Composition over Configuration | PASS | Small composable sub-components preferred |
| V. Design Tokens & Theming | PASS | Tier 1-3 token structure defined in data model |

**Complexity Tracking**:

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Animation library (Framer Motion) | Spec requires complex scroll-triggered animations, parallax, page transitions (FR-011) | CSS-only animations insufficient for scroll-triggered and orchestrated page transitions; Framer Motion is the standard React solution |

## Project Structure

### Documentation (this feature)

```text
specs/002-let-optimize-website/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles + Tailwind
│   └── ...
├── components/
│   ├── ui/                # Base components (button, input, card)
│   ├── layout/            # Layout components (header, footer, nav)
│   ├── sections/          # Page sections (hero, features, cta)
│   └── motion/            # Animation wrappers and utilities
├── lib/
│   ├── design-tokens.ts   # Tier 1-3 token definitions
│   ├── utils.ts           # cn() utility, helpers
│   └── animations/        # Animation configs and presets
├── hooks/
│   ├── use-reduced-motion.ts
│   ├── use-scroll-trigger.ts
│   └── use-media-query.ts
├── types/
│   └── design-system.ts   # TypeScript interfaces for tokens/components
└── styles/
    └── tokens/            # CSS custom properties generated from tokens

tests/
├── unit/                  # Component unit tests
├── integration/           # Page integration tests
├── e2e/                   # Playwright E2E tests
└── accessibility/         # Axe/lighthouse accessibility tests
```

**Structure Decision**: Single Next.js project with App Router. Component organization follows atomic design principles: ui/ (atoms), layout/ (organisms), sections/ (templates). Animation logic isolated in components/motion/ and lib/animations/ for reusability.

## Phase 0: Research

See [research.md](research.md) for detailed findings.

Key decisions:
- **Framework**: Next.js 14+ with App Router for SSG/SSR, image optimization, and routing
- **Styling**: Tailwind CSS with custom design token plugin
- **Animation**: Framer Motion for scroll-triggered animations, page transitions, and parallax
- **Components**: Custom components following shadcn/ui patterns for accessibility and composition
- **Images**: Next.js Image component with WebP/JPEG fallback, lazy loading built-in

## Phase 1: Design & Contracts

See [data-model.md](data-model.md), [contracts/](contracts/), and [quickstart.md](quickstart.md).

## Re-evaluation Post-Design

Constitution check re-evaluated after Phase 1 design completion:

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Systemic over Individual | PASS | All components designed for multi-context reuse |
| II. Accessibility by Default | PASS | All base components include ARIA labels, focus management, keyboard navigation |
| III. Predictability | PASS | Consistent prop naming (isDisabled, isLoading, hasIcon), event handlers (onClick, onChange) |
| IV. Composition over Configuration | PASS | Components expose sub-components (Card.Header, Card.Footer) rather than monolithic props |
| V. Design Tokens & Theming | PASS | Zero hardcoded values; all visual properties reference tokens |

**No violations introduced in design phase.**