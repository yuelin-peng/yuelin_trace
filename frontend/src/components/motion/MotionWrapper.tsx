import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'none';
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  className,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.5,
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  const animations = {
    fadeInUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-100px' }}
      variants={selectedAnimation}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;