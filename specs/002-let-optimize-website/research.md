# Research: Website Visual Optimization

**Date**: 2026-05-15  
**Feature**: Website Visual Optimization  
**Researcher**: AI Planning Agent

## Unknowns Resolved

### 1. Animation Strategy for Complex Motion Design

**Decision**: Use Framer Motion as the primary animation library with GSAP as fallback for complex scroll-triggered sequences.

**Rationale**:
- Framer Motion is the React ecosystem standard for declarative animations
- Native support for AnimatePresence (page transitions), useScroll, useTransform (parallax)
- Excellent TypeScript support and tree-shakeable
- Active community and maintenance
- Plays well with React Server Components when used in client components

**Alternatives considered**:
- **GSAP**: More powerful for complex timelines but heavier bundle size and imperative API. Kept as optional for edge cases.
- **React Spring**: Good physics-based animations but less declarative API for scroll-triggered effects.
- **Vanilla CSS**: Insufficient for orchestrated page transitions and scroll-triggered animations.

**Bundle impact**: ~30kb gzipped (Framer Motion) vs ~90kb (GSAP full). Acceptable given the animation requirements.

### 2. Design Token Architecture

**Decision**: Three-tier token system with CSS custom properties at runtime.

**Rationale**:
- Tier 1 (Global): Raw values (colors, spacing scale, typography scale)
- Tier 2 (Semantic): Contextual aliases (primary, background, text-muted)
- Tier 3 (Component): Component-specific overrides (button-primary-bg)
- CSS custom properties enable runtime theming without recompilation
- Tailwind CSS can reference CSS variables via `var(--token-name)`

**Alternatives considered**:
- **Style Dictionary**: Good for cross-platform but adds build complexity. Using CSS custom properties directly is simpler for web-only.
- **Tailwind config only**: Insufficient for runtime theming and semantic naming.

### 3. Image Optimization Pipeline

**Decision**: Use Next.js built-in Image component with custom loader.

**Rationale**:
- Automatic WebP/AVIF format selection with JPEG fallback
- Built-in lazy loading with blur placeholder support
- Responsive srcset generation
- No additional dependencies needed

**Alternatives considered**:
- **Cloudinary/Imgix**: Excellent but adds external dependency and cost. Next.js Image is sufficient for this scope.
- **Manual optimization**: Too labor-intensive and error-prone.

### 4. Component Architecture

**Decision**: Custom components following shadcn/ui composition patterns.

**Rationale**:
- shadcn/ui demonstrates excellent accessibility and composition patterns
- Copy-paste approach gives full control over styling
- No runtime dependency on a component library
- Easy to customize with design tokens

**Alternatives considered**:
- **MUI/Chakra**: Too opinionated, hard to override completely for a full redesign
- **Radix UI primitives**: Good foundation but requires building all components from scratch

### 5. Responsive Breakpoint Strategy

**Decision**: Mobile-first with 5 breakpoints matching Tailwind defaults.

**Rationale**:
- sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Covers range from 320px to 2560px as specified in requirements
- Tailwind's default breakpoints are well-tested and industry-standard

### 6. Animation Performance on Low-End Devices

**Decision**: Implement progressive enhancement with reduced motion support.

**Rationale**:
- `prefers-reduced-motion` media query disables non-essential animations
- `useReducedMotion` hook wraps all animation components
- Battery saver mode detection via `navigator.getBattery()` where supported
- GPU-accelerated properties only (transform, opacity) for 60fps

## Technical Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| next | ^14.0 | Framework, routing, image optimization |
| react | ^18.0 | UI library |
| react-dom | ^18.0 | DOM renderer |
| typescript | ^5.0 | Type safety |
| tailwindcss | ^3.4 | Utility-first styling |
| framer-motion | ^11.0 | Animations and transitions |
| clsx | ^2.0 | Conditional class merging |
| tailwind-merge | ^2.0 | Tailwind class conflict resolution |
| @types/react | ^18.0 | React type definitions |
| @types/node | ^20.0 | Node.js type definitions |

## Dev Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| jest | ^29.0 | Unit testing |
| @testing-library/react | ^14.0 | React component testing |
| @testing-library/jest-dom | ^6.0 | Custom matchers |
| playwright | ^1.40 | E2E testing |
| @axe-core/react | ^4.8 | Accessibility testing |
| lighthouse | ^11.0 | Performance auditing |
| eslint | ^8.0 | Linting |
| @typescript-eslint/parser | ^6.0 | TypeScript ESLint |
| prettier | ^3.0 | Code formatting |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation performance on low-end devices | Medium | High | Progressive enhancement, reduced motion support, GPU-only properties |
| CLS from lazy-loaded images | Low | High | Next.js Image with priority for above-fold, proper aspect ratios |
| Bundle size from Framer Motion | Low | Medium | Tree-shaking, code splitting by route, dynamic imports for heavy animations |
| Accessibility compliance gaps | Low | High | Automated a11y testing, manual screen reader testing, WCAG checklist |
| Browser compatibility issues | Low | Medium | Testing on latest 2 versions of all major browsers, progressive enhancement |