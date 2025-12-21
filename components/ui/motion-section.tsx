'use client';

import * as React from 'react';
import { motion, type MotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

const viewport = { once: true, amount: 0.2 };

const fadeInVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

type MotionSectionElement = 'div' | 'section' | 'ul';
type BaseMotionProps = Omit<React.HTMLAttributes<HTMLElement>, 'onDrag'>;

interface MotionSectionProps extends BaseMotionProps {
  delay?: number;
  as?: MotionSectionElement;
  motionProps?: MotionProps;
  triggerOnViewport?: boolean;
}

export function MotionSection({
  children,
  className,
  delay = 0,
  as = 'section',
  motionProps,
  triggerOnViewport = true,
}: MotionSectionProps) {
  const componentMap: Record<MotionSectionElement, any> = {
    div: motion.div,
    section: motion.section,
    ul: motion.ul,
  };

  const Component = componentMap[as] ?? motion.section;
  const viewportProps = triggerOnViewport
    ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport }
    : {};

  return (
    <Component
      {...viewportProps}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12, delayChildren: delay },
        },
      }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

type MotionItemElement = 'div' | 'li' | 'section' | 'article' | 'ul';

interface MotionItemProps extends BaseMotionProps {
  as?: MotionItemElement;
  delay?: number;
  motionProps?: MotionProps;
  triggerOnViewport?: boolean;
}

export function MotionItem({
  children,
  className,
  as = 'div',
  delay = 0,
  motionProps,
  triggerOnViewport = true,
  ...props
}: MotionItemProps) {
  const baseProps = {
    variants: fadeInVariants,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  };

  const viewportProps = triggerOnViewport
    ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport }
    : {};

  const componentMap: Record<MotionItemElement, any> = {
    div: motion.div,
    li: motion.li,
    section: motion.section,
    article: motion.article,
    ul: motion.ul,
  };

  const Component = componentMap[as] ?? motion.div;

  return (
    <Component
      {...viewportProps}
      {...baseProps}
      className={cn(className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
