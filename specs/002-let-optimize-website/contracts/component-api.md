# Component API Contract

**Feature**: Website Visual Optimization  
**Date**: 2026-05-15

## Button Component

### Interface

```typescript
interface ButtonProps {
  // Content
  children: React.ReactNode;
  
  // Variants
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  
  // States
  isLoading?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  
  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  
  // Accessibility
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  
  // Styling
  className?: string;
  
  // HTML attributes
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  name?: string;
  value?: string;
}
```

### Behavior Contract

1. **Rendering**: Renders a native `<button>` element with appropriate type
2. **States**:
   - Default: Visible, interactive
   - Hover: Background color shifts to hover variant
   - Active: Background color shifts to active variant, scale reduced by 0.98
   - Focus: Visible focus ring (2px offset, brand color)
   - Disabled: Opacity 0.5, cursor not-allowed, not interactive
   - Loading: Shows spinner, disabled, maintains width to prevent layout shift
3. **Accessibility**:
   - Must be keyboard focusable and operable (Enter/Space)
   - Focus ring must be visible (2px solid brand.500)
   - If no visible text, must have aria-label
   - Loading state must be announced to screen readers
4. **Events**:
   - onClick fires on click and Enter/Space key
   - onFocus/onBlur fire on keyboard focus changes

### Design Token Dependencies

- `interactive.default` (background)
- `interactive.hover` (hover background)
- `interactive.active` (active background)
- `text.inverse` (text color)
- `borderRadius.md` (border radius)
- `spacing.3` / `spacing.4` (padding)
- `fontSize.base` / `fontSize.sm` / `fontSize.lg` (font size)
- `fontWeight.medium` (font weight)

## Input Component

### Interface

```typescript
interface InputProps {
  // Value
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Validation
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  
  // States
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isLoading?: boolean;
  
  // Appearance
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  
  // Accessibility
  label?: string;
  ariaLabel?: string;
  description?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  
  // Styling
  className?: string;
  
  // HTML attributes
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}
```

### Behavior Contract

1. **Rendering**: Renders native `<input>` with associated `<label>` if label prop provided
2. **States**:
   - Default: Border color `border.default`
   - Hover: Border color `border.default` (subtle)
   - Focus: Border color `border.focus`, focus ring visible
   - Invalid: Border color `border.error`, error message displayed
   - Disabled: Background `background.muted`, not interactive
   - Loading: Shows spinner inside input, disabled
3. **Validation**:
   - Error message displayed below input when `isInvalid` is true
   - Required indicator shown when `isRequired` is true
   - Pattern validation on blur
4. **Accessibility**:
   - Label associated via htmlFor
   - Error message linked via aria-describedby
   - Required state indicated via aria-required
   - Invalid state announced via aria-invalid

### Design Token Dependencies

- `background.primary` (background)
- `background.muted` (disabled background)
- `text.primary` (text color)
- `text.muted` (placeholder color)
- `border.default` (default border)
- `border.focus` (focus border)
- `border.error` (error border)
- `borderRadius.md` (border radius)
- `spacing.3` / `spacing.4` (padding)
- `fontSize.base` (font size)

## Card Component

### Interface

```typescript
interface CardProps {
  // Content
  children: React.ReactNode;
  
  // Variants
  variant?: 'default' | 'outlined' | 'elevated';
  
  // Interactivity
  isInteractive?: boolean;
  onClick?: () => void;
  href?: string;
  
  // States
  isDisabled?: boolean;
  
  // Styling
  className?: string;
  
  // Sub-components
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Sub-component interfaces
interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}
```

### Behavior Contract

1. **Rendering**: Renders `<div>` by default, `<a>` if href provided, `<button>` if onClick provided
2. **States**:
   - Default: Background `background.primary`, border `border.default`
   - Hover (interactive): Shadow increases to `boxShadow.lg`, subtle scale (1.01)
   - Focus (interactive): Focus ring visible
   - Active (interactive): Scale reduced to 0.99
3. **Accessibility**:
   - Interactive cards must be keyboard operable
   - Focus ring must be visible
   - If href provided, must support Enter key activation
4. **Composition**:
   - Card.Header, Card.Footer sub-components available
   - Content area flexible for any children

### Design Token Dependencies

- `background.primary` (background)
- `border.default` (border)
- `borderRadius.lg` (border radius)
- `spacing.6` (padding)
- `boxShadow.md` (default shadow)
- `boxShadow.lg` (hover shadow)

## Navigation Component

### Interface

```typescript
interface NavigationProps {
  // Structure
  items: NavigationItem[];
  
  // Configuration
  variant?: 'horizontal' | 'vertical' | 'mobile';
  position?: 'fixed' | 'sticky' | 'static';
  
  // Branding
  logo?: React.ReactNode;
  logoHref?: string;
  
  // Actions
  primaryAction?: React.ReactNode;
  
  // States
  isOpen?: boolean; // Mobile menu state
  onToggle?: () => void;
  
  // Styling
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  isExternal?: boolean;
}
```

### Behavior Contract

1. **Rendering**: Renders `<nav>` landmark element
2. **Responsive Behavior**:
   - Desktop (>768px): Horizontal layout
   - Mobile (≤768px): Hamburger menu, vertical layout
3. **States**:
   - Default: Background with backdrop blur
   - Scrolled: Shadow appears, background opacity increases
   - Mobile open: Full-screen overlay or slide-out panel
4. **Accessibility**:
   - Skip link present ("Skip to main content")
   - Mobile menu toggle has aria-expanded, aria-controls
   - Active page indicated visually and via aria-current
   - Dropdowns support keyboard navigation (arrow keys, Escape)
5. **Interactions**:
   - Click outside mobile menu closes it
   - Escape key closes mobile menu
   - Smooth scroll to sections if hash links

### Design Token Dependencies

- `background.primary/80` (background with blur)
- `text.primary` (text color)
- `text.link` (hover color)
- `interactive.default` (active indicator)
- `spacing.16` (desktop height)
- `spacing.14` (mobile height)
- `boxShadow.md` (scrolled shadow)

## Motion Wrapper Component

### Interface

```typescript
interface MotionWrapperProps {
  children: React.ReactNode;
  
  // Animation configuration
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideIn';
  delay?: number; // seconds
  duration?: number; // seconds
  
  // Trigger configuration
  trigger?: 'onMount' | 'onScroll' | 'onHover' | 'onClick';
  scrollMargin?: string; // e.g., '-100px'
  once?: boolean; // Only animate once
  
  // Parallax (when animation is 'parallax')
  parallaxSpeed?: number; // 0.5 = half speed
  
  // Styling
  className?: string;
  
  // Accessibility
  reducedMotionFallback?: 'instant' | 'fade' | 'none';
}
```

### Behavior Contract

1. **Rendering**: Renders a `<div>` wrapper with Framer Motion behavior
2. **Reduced Motion**:
   - Checks `prefers-reduced-motion` media query
   - If enabled, applies `reducedMotionFallback` behavior:
     - `instant`: Immediate appearance (no animation)
     - `fade`: Simple opacity fade instead of motion
     - `none`: Renders children without wrapper
3. **Scroll-triggered**:
   - Uses Intersection Observer via Framer Motion's `whileInView`
   - Respects `scrollMargin` for early/late triggering
   - `once` controls whether animation replays on re-entry
4. **Parallax**:
   - Maps scroll position to Y transform
   - Speed controls the rate of movement
   - Respects reduced motion (disables parallax)
5. **Performance**:
   - Uses `transform` and `opacity` only (GPU-accelerated)
   - Lazy loads animation library for below-fold content
   - Cleans up observers on unmount

### Design Token Dependencies

- `transition.duration.normal` / `transition.duration.slow` (animation duration)
- `transition.easing.default` / `transition.easing.out` (easing functions)

## Validation Rules

All components must satisfy:

1. **Type Safety**: All props must be typed with TypeScript interfaces
2. **Forward Refs**: All components must forward refs using `forwardRef`
3. **Display Names**: All components must have `displayName` for debugging
4. **Default Props**: Sensible defaults must be provided for all optional props
5. **Composition**: Components must support `children` and `className` for extensibility
6. **Accessibility**: ARIA attributes, keyboard navigation, and focus management as specified
7. **Design Tokens**: No hardcoded values; all styles reference tokens