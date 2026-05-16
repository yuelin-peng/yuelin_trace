# Animation Behavior Contract

**Feature**: Website Visual Optimization  
**Date**: 2026-05-15

## Overview

This contract defines the animation behaviors and requirements for all motion design in the website. All animations must respect user preferences and accessibility standards.

## Animation Categories

### 1. Page Transitions

**Trigger**: Route change
**Behavior**:
- Current page fades out (opacity 1 → 0, 200ms)
- New page fades in (opacity 0 → 1, 300ms) with slight upward movement (y: 20 → 0)
- Duration: 300-500ms total
- Easing: `ease-out` for exit, `ease-in-out` for enter

**Accessibility**:
- Disabled when `prefers-reduced-motion: reduce`
- Instant page swap as fallback

### 2. Scroll-Triggered Reveals

**Trigger**: Element enters viewport
**Behavior**:
- Element starts hidden (opacity: 0, translateY: 40px)
- Animates to visible (opacity: 1, translateY: 0)
- Trigger point: When element is 100px from viewport bottom
- Duration: 500-700ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Stagger: Multiple elements animate with 100ms delay between each

**Variants**:
- `fadeInUp`: Default (translateY: 40px)
- `fadeInLeft`: translateX: -40px
- `fadeInRight`: translateX: 40px
- `scaleIn`: scale: 0.95 → 1

**Accessibility**:
- Disabled when `prefers-reduced-motion: reduce`
- Fallback: Elements appear instantly when in viewport
- Must not interfere with screen reader navigation

### 3. Parallax Effects

**Trigger**: Continuous scroll
**Behavior**:
- Background elements move at slower rate than scroll (speed: 0.3-0.5)
- Foreground elements may move faster (speed: 1.2-1.5)
- Smooth interpolation, no jitter
- Range: Full viewport height

**Constraints**:
- Disabled on mobile devices (touch scrolling conflicts)
- Disabled when `prefers-reduced-motion: reduce`
- Must not cause layout shift (use transform only)
- Max movement: 200px to prevent excessive displacement

### 4. Hover Interactions

**Trigger**: Mouse hover / Touch tap
**Behavior**:
- Cards: Scale 1.02, shadow increase, 200ms
- Buttons: Background color shift, subtle scale 0.98 on press
- Links: Underline animation (width 0% → 100%), 200ms
- Images: Scale 1.05 with overflow hidden, 300ms

**Easing**: `ease-out` for entrance, `ease-in` for exit

**Accessibility**:
- Must also trigger on keyboard focus
- Focus styles must match hover styles
- Touch devices: Tap to trigger (not hover)

### 5. Loading States

**Trigger**: Async operation / Initial load
**Behavior**:
- Skeleton screens: Pulsing opacity (0.5 → 1 → 0.5), 1.5s loop
- Spinners: Continuous rotation, 1s loop
- Progress bars: Width animation with easing

**Accessibility**:
- Loading state must be announced to screen readers
- `aria-busy="true"` on loading regions
- `aria-live="polite"` for status updates

### 6. Micro-interactions

**Trigger**: User action feedback
**Behavior**:
- Form validation: Shake animation on error (translateX: -5px → 5px → 0), 300ms
- Success checkmark: Draw animation (stroke-dashoffset), 500ms
- Toggle switches: Slide with spring physics
- Notification badges: Scale bounce (1 → 1.2 → 1), 300ms

## Performance Requirements

### 60fps Standard

All animations must maintain 60fps on:
- Mid-range desktop (Intel i5, 8GB RAM)
- Modern smartphones (iPhone 12, Pixel 6 equivalent)

### Optimization Rules

1. **GPU-Accelerated Properties Only**:
   - ✅ transform (translate, scale, rotate)
   - ✅ opacity
   - ❌ width, height, top, left, margin, padding

2. **will-change Usage**:
   - Add before animation starts
   - Remove after animation completes
   - Use sparingly (max 5 elements simultaneously)

3. **Intersection Observer**:
   - Use for scroll-triggered animations
   - Unobserve after animation completes (if `once: true`)

4. **Debouncing**:
   - Scroll events debounced at 16ms (1 frame)
   - Resize events debounced at 100ms

## Reduced Motion Support

### Detection

```typescript
const prefersReducedMotion = 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Fallback Behaviors

| Animation Type | Reduced Motion Fallback |
|----------------|------------------------|
| Page transitions | Instant swap |
| Scroll reveals | Instant appearance |
| Parallax | Static positioning |
| Hover effects | Color change only (no motion) |
| Loading states | Static placeholder (no pulse) |
| Micro-interactions | Instant state change |

### Battery Saver Detection

```typescript
// Optional enhancement
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    if (battery.level < 0.2 && !battery.charging) {
      // Disable non-essential animations
    }
  });
}
```

## Animation Tokens

All animation values reference design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `transition.duration.fast` | 150ms | Hover states |
| `transition.duration.normal` | 200ms | Standard transitions |
| `transition.duration.slow` | 300ms | Page transitions |
| `transition.duration.slower` | 500ms | Complex animations |
| `transition.easing.default` | ease-in-out | Standard |
| `transition.easing.out` | ease-out | Entrances |
| `transition.easing.spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy effects |

## Testing Requirements

### Automated Tests

1. **Reduced Motion**: Verify all animations respect `prefers-reduced-motion`
2. **Performance**: Lighthouse animation audit ≥ 90
3. **No Layout Shift**: CLS impact from animations = 0

### Manual Tests

1. **Keyboard Navigation**: All interactive animations trigger on focus
2. **Screen Readers**: No confusing motion announcements
3. **Mobile**: Parallax disabled, touch interactions work
4. **Low-end Devices**: Animations degrade gracefully

## Prohibited Patterns

❌ Animating layout properties (width, height, top, left)
❌ Continuous animations running in background
❌ Animations triggered on every scroll event (without throttling)
❌ Flashing content (>3 flashes per second)
❌ Auto-playing video backgrounds without pause controls
❌ Parallax on mobile devices
❌ Mandatory animations (all must have reduced-motion fallback)