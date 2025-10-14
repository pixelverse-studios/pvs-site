'use client';

import * as React from 'react';
import { motion, type MotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

const viewport = { once: true, amount: 0.2 };

const fadeInVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 }
};

interface MotionSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  as?: 'div' | 'section';
  motionProps?: MotionProps;
}

export function MotionSection({
  children,
  className,
  delay = 0,
  as = 'section',
  motionProps
}: MotionSectionProps) {
  const Component = as === 'section' ? motion.section : motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12, delayChildren: delay }
        }
      }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

interface MotionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  motionProps?: MotionProps;
  triggerOnViewport?: boolean;
}

export function MotionItem({
  children,
  className,
  delay = 0,
  motionProps,
  triggerOnViewport = true,
  ...props
}: MotionItemProps) {
  const baseProps = {
    variants: fadeInVariants,
    transition: { duration: 0.6, ease: 'easeOut', delay }
  };

  const viewportProps = triggerOnViewport
    ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport }
    : {};

  return (
    <motion.div
      {...viewportProps}
      {...baseProps}
      className={cn(className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
