import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Card } from '@/components/ui/Card';

export interface FeatureGridProps {
  className?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      title: 'Modern Design',
      description: 'Clean, professional interface built with the latest design principles and accessibility standards.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'Responsive',
      description: 'Seamless experience across all devices from mobile phones to ultra-wide desktop monitors.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Accessible',
      description: 'WCAG 2.1 AA compliant with full keyboard navigation, screen reader support, and reduced motion options.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'Fast Performance',
      description: 'Optimized Core Web Vitals with lazy loading, image optimization, and efficient code splitting.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={cn('py-20 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why Choose Yuelin?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern technologies and best practices for the best user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Card className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#f0f9ff] text-[#0284c7] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;