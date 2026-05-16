# Data Model: Design System

**Feature**: Website Visual Optimization  
**Date**: 2026-05-15

## Design Token Tiers

### Tier 1: Global Tokens

Raw values that form the foundation of the design system.

```typescript
interface GlobalTokens {
  // Colors
  colors: {
    // Brand palette
    brand: {
      50: string;   // #f0f9ff
      100: string;  // #e0f2fe
      200: string;  // #bae6fd
      300: string;  // #7dd3fc
      400: string;  // #38bdf8
      500: string;  // #0ea5e9
      600: string;  // #0284c7
      700: string;  // #0369a1
      800: string;  // #075985
      900: string;  // #0c4a6e
      950: string;  // #082f49
    };
    // Neutral scale
    gray: {
      50: string;   // #f9fafb
      100: string;  // #f3f4f6
      200: string;  // #e5e7eb
      300: string;  // #d1d5db
      400: string;  // #9ca3af
      500: string;  // #6b7280
      600: string;  // #4b5563
      700: string;  // #374151
      800: string;  // #1f2937
      900: string;  // #111827
      950: string;  // #030712
    };
    // Semantic colors
    success: string;  // #22c55e
    warning: string;  // #f59e0b
    error: string;    // #ef4444
    info: string;     // #3b82f6
  };

  // Typography
  fontFamily: {
    sans: string;     // 'Inter', system-ui, sans-serif
    serif: string;    // 'Merriweather', Georgia, serif
    mono: string;     // 'Fira Code', monospace
  };
  fontSize: {
    xs: string;       // 0.75rem (12px)
    sm: string;       // 0.875rem (14px)
    base: string;     // 1rem (16px)
    lg: string;       // 1.125rem (18px)
    xl: string;       // 1.25rem (20px)
    '2xl': string;    // 1.5rem (24px)
    '3xl': string;    // 1.875rem (30px)
    '4xl': string;    // 2.25rem (36px)
    '5xl': string;    // 3rem (48px)
    '6xl': string;    // 3.75rem (60px)
    '7xl': string;    // 4.5rem (72px)
  };
  fontWeight: {
    thin: number;     // 100
    light: number;    // 300
    normal: number;   // 400
    medium: number;   // 500
    semibold: number; // 600
    bold: number;     // 700
    extrabold: number;// 800
  };
  lineHeight: {
    none: number;     // 1
    tight: number;    // 1.25
    snug: number;     // 1.375
    normal: number;   // 1.5
    relaxed: number;  // 1.625
    loose: number;    // 2
  };
  letterSpacing: {
    tighter: string;  // -0.05em
    tight: string;    // -0.025em
    normal: string;   // 0em
    wide: string;     // 0.025em
    wider: string;    // 0.05em
    widest: string;   // 0.1em
  };

  // Spacing
  spacing: {
    0: string;    // 0px
    1: string;    // 4px
    2: string;    // 8px
    3: string;    // 12px
    4: string;    // 16px
    5: string;    // 20px
    6: string;    // 24px
    8: string;    // 32px
    10: string;   // 40px
    12: string;   // 48px
    16: string;   // 64px
    20: string;   // 80px
    24: string;   // 96px
    32: string;   // 128px
    40: string;   // 160px
    48: string;   // 192px
    56: string;   // 224px
    64: string;   // 256px
  };

  // Border radius
  borderRadius: {
    none: string;   // 0px
    sm: string;     // 2px
    base: string;   // 4px
    md: string;     // 6px
    lg: string;     // 8px
    xl: string;     // 12px
    '2xl': string;  // 16px
    '3xl': string;  // 24px
    full: string;   // 9999px
  };

  // Shadows
  boxShadow: {
    sm: string;     // 0 1px 2px 0 rgb(0 0 0 / 0.05)
    base: string;   // 0 1px 3px 0 rgb(0 0 0 / 0.1)
    md: string;     // 0 4px 6px -1px rgb(0 0 0 / 0.1)
    lg: string;     // 0 10px 15px -3px rgb(0 0 0 / 0.1)
    xl: string;     // 0 20px 25px -5px rgb(0 0 0 / 0.1)
    '2xl': string;  // 0 25px 50px -12px rgb(0 0 0 / 0.25)
    inner: string;  // inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
    none: string;   // none
  };

  // Transitions
  transition: {
    duration: {
      fast: string;     // 150ms
      normal: string;   // 200ms
      slow: string;     // 300ms
      slower: string;   // 500ms
    };
    easing: {
      default: string;  // cubic-bezier(0.4, 0, 0.2, 1)
      in: string;       // cubic-bezier(0.4, 0, 1, 1)
      out: string;      // cubic-bezier(0, 0, 0.2, 1)
      inOut: string;    // cubic-bezier(0.4, 0, 0.2, 1)
      spring: string;   // cubic-bezier(0.34, 1.56, 0.64, 1)
    };
  };

  // Z-index scale
  zIndex: {
    hide: number;     // -1
    auto: string;     // auto
    base: number;     // 0
    docked: number;   // 10
    dropdown: number; // 1000
    sticky: number;   // 1100
    banner: number;   // 1200
    overlay: number;  // 1300
    modal: number;    // 1400
    popover: number;  // 1500
    skipLink: number; // 1600
    toast: number;    // 1700
    tooltip: number;  // 1800
  };
}
```

### Tier 2: Semantic Tokens

Contextual aliases that map Tier 1 values to meaning.

```typescript
interface SemanticTokens {
  // Background colors
  background: {
    primary: string;    // gray.50 (light) / gray.900 (dark)
    secondary: string;  // gray.100 (light) / gray.800 (dark)
    tertiary: string;   // gray.200 (light) / gray.700 (dark)
    inverse: string;    // gray.900 (light) / gray.50 (dark)
    muted: string;      // gray.100 (light) / gray.800 (dark)
    overlay: string;    // gray.900/70 (light) / gray.950/80 (dark)
  };

  // Text colors
  text: {
    primary: string;    // gray.900 (light) / gray.50 (dark)
    secondary: string;  // gray.600 (light) / gray.400 (dark)
    muted: string;      // gray.500 (light) / gray.500 (dark)
    inverse: string;    // gray.50 (light) / gray.900 (dark)
    link: string;       // brand.600 (light) / brand.400 (dark)
    linkHover: string;  // brand.700 (light) / brand.300 (dark)
  };

  // Border colors
  border: {
    default: string;    // gray.200 (light) / gray.700 (dark)
    muted: string;      // gray.100 (light) / gray.800 (dark)
    inverse: string;    // gray.700 (light) / gray.200 (dark)
    focus: string;      // brand.500
    error: string;      // error.500
  };

  // Interactive states
  interactive: {
    default: string;    // brand.600
    hover: string;      // brand.700
    active: string;     // brand.800
    disabled: string;   // gray.300
    focusRing: string;  // brand.500/30
  };

  // Status colors
  status: {
    success: string;    // success.500
    warning: string;    // warning.500
    error: string;      // error.500
    info: string;       // info.500
  };
}
```

### Tier 3: Component Tokens

Component-specific values that reference Tier 1 and Tier 2 tokens.

```typescript
interface ComponentTokens {
  button: {
    // Primary variant
    primary: {
      background: string;        // interactive.default
      backgroundHover: string;   // interactive.hover
      backgroundActive: string;  // interactive.active
      text: string;              // text.inverse
      border: string;            // transparent
      borderRadius: string;      // borderRadius.md
      padding: string;           // spacing.3 spacing.4
      fontSize: string;          // fontSize.base
      fontWeight: number;        // fontWeight.medium
    };
    // Secondary variant
    secondary: {
      background: string;        // background.secondary
      backgroundHover: string;   // background.tertiary
      backgroundActive: string;  // border.default
      text: string;              // text.primary
      border: string;            // border.default
    };
    // Ghost variant
    ghost: {
      background: string;        // transparent
      backgroundHover: string;   // background.secondary
      text: string;              // text.primary
    };
    // Sizes
    sizes: {
      sm: { height: string; padding: string; fontSize: string; };
      md: { height: string; padding: string; fontSize: string; };
      lg: { height: string; padding: string; fontSize: string; };
    };
  };

  input: {
    background: string;          // background.primary
    backgroundDisabled: string;  // background.muted
    text: string;                // text.primary
    textPlaceholder: string;     // text.muted
    border: string;              // border.default
    borderHover: string;         // border.default
    borderFocus: string;         // border.focus
    borderError: string;         // border.error
    borderRadius: string;        // borderRadius.md
    padding: string;             // spacing.3 spacing.4
    fontSize: string;            // fontSize.base
  };

  card: {
    background: string;          // background.primary
    border: string;              // border.default
    borderRadius: string;        // borderRadius.lg
    padding: string;             // spacing.6
    shadow: string;              // boxShadow.md
    shadowHover: string;         // boxShadow.lg
  };

  navigation: {
    background: string;          // background.primary/80 (with backdrop blur)
    text: string;                // text.primary
    textHover: string;           // text.link
    textActive: string;          // interactive.default
    height: string;              // spacing.16
    mobileHeight: string;        // spacing.14
  };
}
```

## Animation Presets

```typescript
interface AnimationPresets {
  // Fade in from bottom
  fadeInUp: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number; ease: string };
  };
  // Fade in from left
  fadeInLeft: {
    initial: { opacity: number; x: number };
    animate: { opacity: number; x: number };
    transition: { duration: number; ease: string };
  };
  // Scale in
  scaleIn: {
    initial: { opacity: number; scale: number };
    animate: { opacity: number; scale: number };
    transition: { duration: number; ease: string };
  };
  // Stagger children
  staggerContainer: {
    animate: { transition: { staggerChildren: number; delayChildren: number } };
  };
  // Page transition
  pageTransition: {
    initial: { opacity: number };
    animate: { opacity: number };
    exit: { opacity: number };
    transition: { duration: number };
  };
  // Parallax scroll
  parallax: {
    speed: number;  // 0.5 = half speed
    direction: 'up' | 'down';
  };
}
```

## Breakpoint System

```typescript
interface Breakpoints {
  sm: string;   // 640px
  md: string;   // 768px
  lg: string;   // 1024px
  xl: string;   // 1280px
  '2xl': string;// 1536px
}
```

## Component Registry

| Component | Type | Props Interface | Accessibility |
|-----------|------|----------------|---------------|
| Button | atom | ButtonProps | Keyboard operable, focus visible, ARIA labels |
| Input | atom | InputProps | Label association, error messages, focus management |
| Card | molecule | CardProps | Semantic HTML, focusable if interactive |
| Navigation | organism | NavigationProps | Skip link, keyboard navigation, mobile menu |
| HeroSection | template | HeroSectionProps | Heading hierarchy, alt text for images |
| FeatureGrid | template | FeatureGridProps | Semantic list, focus management |
| Footer | organism | FooterProps | Landmark region, link labels |
| MotionWrapper | utility | MotionWrapperProps | Respects reduced motion |

## Validation Rules

1. **No hardcoded values**: All visual properties must reference a design token
2. **Contrast compliance**: All text/background combinations must meet WCAG 2.1 AA (4.5:1 normal, 3:1 large)
3. **Animation safety**: All animations must respect `prefers-reduced-motion`
4. **Responsive coverage**: All layouts must work from 320px to 2560px
5. **Keyboard accessibility**: All interactive elements must be keyboard accessible
6. **Focus management**: All focusable elements must have visible focus indicators