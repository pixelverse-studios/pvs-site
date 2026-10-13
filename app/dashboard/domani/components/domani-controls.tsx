'use client';
import React from 'react';
import { Drawer, type DrawerProps } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import styles from './domani-controls.module.css';

export const fieldClassNames = { input: styles.input };
export const selectClassNames = { ...fieldClassNames, dropdown: styles.dropdown };
export function DomaniDrawer({
  filter,
  contained,
  ...props
}: DrawerProps & { filter?: boolean; contained?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <Drawer
      closeButtonProps={{ 'aria-label': 'Close' }}
      size="var(--domani-drawer-width)"
      position="right"
      padding="md"
      transitionProps={{ duration: reduceMotion ? 0 : 220 }}
      classNames={{
        root: filter ? styles.filterDrawer : styles.drawer,
        content: styles.drawerContent,
        header: styles.drawerHeader,
        body: filter || contained ? styles.containedBody : styles.drawerBody,
      }}
      {...props}
    />
  );
}
