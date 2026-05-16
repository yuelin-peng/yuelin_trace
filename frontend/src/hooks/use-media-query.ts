import { useState, useEffect } from 'react';

/**
 * Hook to detect media query matches
 * Usage: const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/**
 * Hook to detect if device is mobile (width < 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * Hook to detect if device is tablet (width 768px - 1024px)
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
}

/**
 * Hook to detect if device is desktop (width > 1024px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}