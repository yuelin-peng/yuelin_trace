# Quickstart: Website Visual Optimization

**Feature**: Website Visual Optimization  
**Date**: 2026-05-15

## Prerequisites

- Node.js 18+ 
- npm 9+ or yarn 1.22+ or pnpm 8+
- Git

## Setup

### 1. Clone and Install

```bash
git checkout 002-let-optimize-website
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SITE_URL` - Production site URL
- `NEXT_PUBLIC_ASSET_PREFIX` - CDN prefix for assets (optional)

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Design Token Generation

```bash
npm run tokens:build
```

Generates CSS custom properties from `src/lib/design-tokens.ts` to `src/styles/tokens/`

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build with static export |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format all files |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:a11y` | Run accessibility tests |
| `npm run tokens:build` | Generate CSS custom properties from tokens |
| `npm run tokens:watch` | Watch token files and rebuild |

## Component Development

### Adding a New Component

1. Create component file in appropriate directory:
   - `src/components/ui/` - Base components (Button, Input, Card)
   - `src/components/layout/` - Layout components (Header, Footer, Navigation)
   - `src/components/sections/` - Page sections (Hero, Features, CTA)
   - `src/components/motion/` - Animation components

2. Follow the component template:

```tsx
// src/components/ui/button.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  // Base styles using design tokens
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-interactive-default text-text-inverse hover:bg-interactive-hover',
        secondary: 'bg-background-secondary text-text-primary border border-border-default',
        ghost: 'hover:bg-background-secondary',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner className="mr-2" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

3. Export from barrel file:

```tsx
// src/components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
// ...
```

### Using Design Tokens

Always reference tokens, never hardcode values:

```tsx
// ✅ Good - uses design tokens
<div className="bg-background-primary text-text-primary p-spacing-4">

// ❌ Bad - hardcoded values
<div className="bg-white text-black p-4">
```

### Adding Animations

Wrap components with motion components:

```tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/presets';

export function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      viewport={{ once: true, margin: '-100px' }}
      transition={fadeInUp.transition}
    >
      {children}
    </motion.div>
  );
}
```

### Reduced Motion Support

All animations must respect user preferences:

```tsx
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function SafeAnimation({ children }) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <>{children}</>;
  }
  
  return <motion.div {...animationProps}>{children}</motion.div>;
}
```

## Testing

### Unit Tests

```tsx
// src/components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Tests

```bash
npm run test:a11y
```

Runs axe-core checks on all pages.

### E2E Tests

```bash
npm run test:e2e
```

Runs Playwright tests for critical user journeys.

## Deployment

### Static Export

```bash
npm run build
```

Outputs to `dist/` directory for static hosting.

### Environment-Specific Builds

```bash
# Development
npm run build -- --env development

# Staging
npm run build -- --env staging

# Production
npm run build -- --env production
```

## Troubleshooting

### Build Errors

- Ensure Node.js version is 18+: `node --version`
- Clear cache: `rm -rf .next node_modules && npm install`

### Token Not Found

- Regenerate tokens: `npm run tokens:build`
- Check token name matches definition in `src/lib/design-tokens.ts`

### Animation Performance

- Check for layout thrashing (animating width/height/top/left)
- Use `transform` and `opacity` only for 60fps
- Enable `will-change` sparingly
- Test on low-end devices

## Resources

- [Design Tokens](data-model.md) - Complete token reference
- [Component Contracts](contracts/) - API specifications
- [Research](research.md) - Technical decisions and alternatives