import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIsMobile } from '@/hooks/use-media-query';

export interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'Topics', href: '/topics' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md'
          : 'bg-transparent',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#0284c7]">Yuelin</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#0284c7] transition-colors font-medium py-2 px-3 rounded-md min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-md text-gray-700 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#0284c7] hover:bg-gray-50 min-h-[44px] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Import Button for the navigation
import { Button } from '@/components/ui/Button';

export default Navigation;