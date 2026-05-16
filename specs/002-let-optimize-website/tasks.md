# Tasks: Website Visual Optimization

**Input**: Design documents from `specs/002-let-optimize-website/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, research.md

**Tests**: Not explicitly requested. Accessibility and visual regression tests included as validation tasks.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with required dependencies and tooling

- [X] T001 Initialize Next.js project with TypeScript and Tailwind CSS (existing project kept on v13.5.9 due to Node.js 16 constraint)
- [X] T002 [P] Install core dependencies: framer-motion, clsx, tailwind-merge
- [X] T003 [P] Install dev dependencies: @axe-core/react, prettier (jest, @testing-library/react, playwright already existed)
- [X] T004 Configure Tailwind CSS with custom design tokens in tailwind.config.ts
- [X] T005 Configure TypeScript compiler options in tsconfig.json (already configured with @/ alias)
- [X] T006 ESLint and Prettier configuration files already existed
- [X] T007 Playwright test configuration already existed
- [X] T008 Jest configuration already existed
- [X] T009 Create project directory structure per implementation plan
- [ ] T009a Setup Storybook configuration (.storybook/main.ts, .storybook/preview.tsx, .storybook/preview-head.html) with Next.js, Tailwind, and design token support
- [ ] T009b Install Storybook addon dependencies: @storybook/addon-a11y, @storybook/addon-interactions, @storybook/addon-viewport
- [ ] T009c Configure snapshot testing with jest-image-snapshot or Playwright screenshots in jest.config.js / playwright.config.ts
- [ ] T009d Establish baseline screenshots for critical components (Button, Input, Card, Navigation) at multiple breakpoints

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design tokens, base utilities, and core hooks required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 [P] Implement Tier 1 global design tokens (colors, typography, spacing, shadows) in src/lib/design-tokens.ts
- [X] T011 [P] Implement Tier 2 semantic tokens (background, text, border, interactive, status) - included in design-tokens.ts
- [X] T012 [P] Implement Tier 3 component tokens (button, input, card, navigation) - included in component styling
- [ ] T013 Generate CSS custom properties from design tokens in src/styles/tokens/ using build script
- [X] T014 Create cn() utility function in src/lib/utils.ts for conditional class merging
- [ ] T015 Create TypeScript type definitions for design system in src/types/design-system.ts
- [X] T016 Implement useReducedMotion hook in src/hooks/use-reduced-motion.ts
- [X] T017 Implement useMediaQuery hook in src/hooks/use-media-query.ts
- [ ] T018 Implement useScrollTrigger hook in src/hooks/use-scroll-trigger.ts
- [X] T019 Create animation presets (fadeInUp, fadeInLeft, scaleIn, stagger, pageTransition, parallax) in src/lib/animations/presets.ts
- [X] T020 Create MotionWrapper component in src/components/motion/MotionWrapper.tsx for reduced-motion-safe animations
- [X] T021 Setup global CSS with Tailwind directives in src/styles/globals.css
- [X] T022 Create root layout (_app.tsx) with global styles import

**Checkpoint**: Foundation ready - design tokens, hooks, utilities, and animation infrastructure available for all user stories

---

## Phase 3: User Story 1 - Improve Visual Appeal and First Impressions (Priority: P1) 🎯 MVP

**Goal**: Deliver a visually stunning homepage and consistent global layout (header, footer, navigation) that creates a modern, professional first impression

**Independent Test**: Homepage loads with modern design, navigation works, animations play, and visual appeal is measurably improved

### Base Components (used across all stories)

- [X] T023 [P] [US1] Create Button component in src/components/ui/Button.tsx with primary/secondary/ghost variants
- [ ] T023a [P] [US1] Write Storybook stories for Button component showing all 6 visual states in src/components/ui/Button.stories.tsx
- [ ] T024 [P] [US1] Create Input component in src/components/ui/Input.tsx with label, error, and focus states
- [ ] T024a [P] [US1] Write Storybook stories for Input component showing default, error, disabled states in src/components/ui/Input.stories.tsx
- [X] T025 [P] [US1] Create Card component in src/components/ui/Card.tsx with interactive variant
- [ ] T025a [P] [US1] Write Storybook stories for Card component showing default, hover, interactive variants in src/components/ui/Card.stories.tsx
- [X] T026 [US1] Create Navigation component in src/components/layout/Navigation.tsx with desktop/mobile variants
- [X] T026a [P] [US1] Implement active/current page visual indicator in Navigation component using design tokens (background highlight, underline, or border indicator)
- [ ] T026b [P] [US1] Write Storybook stories for Navigation component showing desktop, mobile, and active states in src/components/layout/Navigation.stories.tsx
- [X] T027 [US1] Create Footer component in src/components/layout/Footer.tsx
- [ ] T027a [P] [US1] Write Storybook stories for Footer component in src/components/layout/Footer.stories.tsx
- [ ] T028 [P] [US1] Export all UI components from src/components/ui/index.ts

### Homepage Implementation

- [X] T029 [US1] Create HeroSection component in src/components/sections/HeroSection.tsx with headline, CTA, and background
- [X] T030 [US1] Implement scroll-triggered fade-in animations on HeroSection using MotionWrapper
- [X] T031 [US1] Create FeatureGrid component in src/components/sections/FeatureGrid.tsx for showcasing content
- [X] T032 [US1] Implement staggered entrance animations for FeatureGrid items
- [ ] T033 [US1] Create CTASection component in src/components/sections/CTASection.tsx
- [X] T034 [US1] Build homepage page in src/pages/index.tsx composing all sections
- [ ] T035 [US1] Implement page transition wrapper in src/components/motion/PageTransition.tsx
- [ ] T036 [US1] Add loading skeleton states for async content in src/components/ui/Skeleton.tsx
- [ ] T037 [US1] Create error boundary with visually coherent error display in src/components/ui/ErrorBoundary.tsx
- [ ] T038 [US1] Add favicon, meta tags, and Open Graph tags for SEO in src/pages/_app.tsx
- [X] T039 [US1] Implement scroll-aware navigation and active page highlighting (shadow/background change on scroll + current page indicator) in Navigation.tsx

**Checkpoint**: User Story 1 complete - homepage is visually stunning, navigation works, animations respect reduced motion, all independently testable

---

## Phase 4: User Story 2 - Enhance Readability and Content Consumption (Priority: P2)

**Goal**: Deliver typography system, content page layouts, and reading experience that maximizes content comprehension and engagement

**Independent Test**: Content pages (blog posts, articles) display with excellent typography, contrast, and hierarchy; readable on all devices

### Typography System

- [X] T040 [US2] Create typography scale CSS classes and components in src/components/ui/Typography.tsx (Heading, Text, Lead, Small, Blockquote, Divider, Code, Pre)
- [X] T041 [US2] Implement article/blog post page layout in src/pages/article/[id].tsx with new design system
- [X] T042 [US2] Create ContentPage wrapper component in src/components/layout/ContentPage.tsx with reading-width container
- [X] T043 [US2] Add table of contents component with scroll-spy in src/components/ui/TableOfContents.tsx
- [ ] T044 [US2] Implement code block styling with syntax highlighting integration in src/components/ui/CodeBlock.tsx
- [X] T045 [US2] Create Image component wrapper in src/components/ui/Image.tsx with lazy loading and fallback
- [X] T046 [US2] Create Blockquote component in src/components/ui/Typography.tsx
- [X] T047 [US2] Create Divider/HorizontalRule component in src/components/ui/Typography.tsx
- [X] T048 [US2] Implement list styling with proper spacing via Tailwind prose classes
- [X] T049 [US2] Add reading progress indicator in src/components/ui/ReadingProgress.tsx
- [X] T050 [US2] Implement "reading time" estimation display in article page
- [ ] T051 [US2] Add print stylesheet support for content pages in src/styles/print.css
- [ ] T052 [US2] Create content index/listing page in src/pages/blog/page.tsx

**Checkpoint**: User Story 2 complete - content pages have excellent typography, readability metrics improved, images optimized, independently testable

---

## Phase 5: User Story 3 - Ensure Responsive Experience Across Devices (Priority: P3)

**Goal**: Deliver fully responsive layouts that adapt gracefully from 320px to 2560px with touch-optimized interactions

**Independent Test**: Website renders correctly on mobile, tablet, and desktop without horizontal scrolling; touch targets appropriate; orientation changes handled

### Responsive Layout System

- [X] T053 [US3] Responsive grid system using Tailwind's built-in grid and flexbox utilities
- [X] T054 [US3] Mobile navigation menu integrated into Navigation component with hamburger button
- [X] T055 [US3] Responsive spacing utilities via Tailwind's spacing scale
- [X] T056 [US3] Responsive typography scale via Tailwind's text sizes and prose classes
- [X] T057 [US3] All interactive elements meet minimum 44x44px touch target size (nav links, buttons, mobile menu items)
- [ ] T058 [US3] Add touch gesture support for carousels/sliders (if present) in src/hooks/use-touch-gestures.ts
- [X] T059 [US3] Images use responsive sizing with max-width: 100% and aspect ratio support
- [X] T060 [US3] Safe area insets support added in globals.css (env(safe-area-inset-*))
- [ ] T061 [US3] Add responsive breakpoint debugging overlay (dev-only) in src/components/dev/BreakpointIndicator.tsx
- [X] T062 [US3] Layout tested and fixed for mobile (320px+), tablet (768px+), desktop (1024px+)
- [X] T063 [US3] Orientation change handling supported via responsive CSS and useMediaQuery hook
- [ ] T064 [US3] Add responsive table handling (horizontal scroll or card layout) in src/components/ui/Table.tsx

**Checkpoint**: User Story 3 complete - website fully responsive, touch-friendly, no horizontal scroll, independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance, animation system completion, and final validation

### Accessibility (WCAG 2.1 AA)

- [X] T065 [P] Add skip navigation link in SkipLink component, integrated into ContentPage and homepage
- [ ] T066 [P] Implement focus trap for modals/mobile menu in src/hooks/use-focus-trap.ts
- [X] T067 [P] Add ARIA labels and roles to Navigation (aria-label, aria-expanded) and interactive components
- [X] T068 [P] Implement focus visible styles for all focusable elements in globals.css (outline: 2px solid #0284c7)
- [ ] T069 Run automated accessibility audit (axe-core) and fix all violations
- [ ] T070 Test keyboard navigation flow through all pages and components
- [X] T071 Verify color contrast ratios (4.5:1 normal, 3:1 large) across all components - using WCAG AA compliant colors
- [ ] T072 Test with screen reader (NVDA/VoiceOver) and fix issues

### Animation System Completion

- [ ] T073 [P] Implement parallax scroll effect component in src/components/motion/Parallax.tsx
- [ ] T074 [P] Create animated illustration wrapper in src/components/motion/AnimatedIllustration.tsx
- [ ] T075 Add page transition animations between routes in src/app/layout.tsx
- [ ] T076 Implement scroll-triggered section reveals on all page sections
- [ ] T077 Add micro-interactions (hover states, button presses, link underlines) across all interactive elements
- [ ] T078 Implement loading state animations (skeletons, spinners, progress bars)

### Performance & Core Web Vitals

- [ ] T079 [P] Optimize images with Next.js Image component and responsive srcset
- [ ] T080 [P] Implement font loading strategy (swap, preload critical fonts)
- [ ] T081 Add code splitting and dynamic imports for heavy animation components
- [ ] T082 Configure caching headers for static assets
- [ ] T083 Run Lighthouse audit and optimize until score ≥90 (performance, accessibility, best practices, SEO)
- [ ] T084 Verify Core Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] T085 Add service worker for offline support (optional but recommended)

### Error States & Edge Cases

- [X] T086 Create custom 404 page in src/pages/404.tsx with visually coherent design
- [X] T087 Create custom 500 error page in src/pages/500.tsx
- [X] T088 Implement image fallback (placeholder) when images fail to load in Image.tsx
- [ ] T089 Add noscript fallback for JavaScript-disabled browsers
- [X] T090 Test and handle reduced motion preferences across all animations (useReducedMotion hook used in all animated components)
- [ ] T091 Test and fix animations on low-end devices / battery saver mode
- [X] T092 Handle ultra-wide monitor layouts (2560px+) gracefully using max-width containers

### Documentation & Validation

- [ ] T093 Update quickstart.md with any deviations from planned setup
- [ ] T094 Run all Playwright E2E tests (homepage, content pages, navigation, responsiveness)
- [ ] T095 Run all Jest unit tests (components, hooks, utilities)
- [ ] T096 [P] Run visual regression snapshot tests comparing current screenshots against baselines for all components
- [ ] T096a [P] Update baseline snapshots after intentional visual changes with team approval
- [ ] T097 Verify all success criteria (SC-001 through SC-008) are measurable and testable
- [ ] T098 Final code review: ensure zero hardcoded values, all design tokens used correctly
- [ ] T098a Verify 100% Storybook coverage: all components have stories with interactive controls and viewport testing
- [ ] T098b Run Storybook interaction tests for all components with user events (click, focus, keyboard)

**Checkpoint**: All cross-cutting concerns addressed - website is accessible, performant, animated, and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. **MVP target.**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses base components from US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses base components from US1 but independently testable

### Within Each User Story

- Base components before section/page implementation
- Layout components before page composition
- Animation wrappers before animated sections
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once Foundational phase completes, all user stories can start in parallel
- Base components (T023-T025) can be built in parallel
- Accessibility fixes (T065-T072) can be done in parallel
- Performance optimizations (T079-T085) can be done in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all base components for User Story 1 together:
Task: "Create Button component in src/components/ui/Button.tsx"
Task: "Create Input component in src/components/ui/Input.tsx"
Task: "Create Card component in src/components/ui/Card.tsx"

# Launch all section components together (after base components):
Task: "Create HeroSection component in src/components/sections/HeroSection.tsx"
Task: "Create FeatureGrid component in src/components/sections/FeatureGrid.tsx"
Task: "Create CTASection component in src/components/sections/CTASection.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (homepage + global layout)
4. **STOP and VALIDATE**: Test homepage independently, run Lighthouse audit
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Run Phase 6: Polish → Final validation → Production deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (homepage, layout, animations)
   - Developer B: User Story 2 (content pages, typography, images)
   - Developer C: User Story 3 (responsive design, mobile optimization)
3. Stories complete and integrate independently
4. Team converges on Phase 6: Polish (accessibility, performance, cross-cutting)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify components render correctly before adding animations
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence