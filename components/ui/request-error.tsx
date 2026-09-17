'use client';

import React from 'react';
import Link from 'next/link';
import { Alert, Button, Stack, Text } from '@mantine/core';
import { AlertCircle } from 'lucide-react';

type RecoveryAction = { label: string; disabled?: boolean } & (
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never }
);

export interface RequestErrorProps {
  title?: string;
  message: string;
  detail?: string;
  action?: RecoveryAction;
}

/** Shared request failure presentation; callers own the recovery behavior. */
export function RequestError({
  title = 'Unable to load data',
  message,
  detail,
  action,
}: RequestErrorProps) {
  return (
    <Alert
      color="red"
      variant="light"
      title={title}
      icon={<AlertCircle size={18} aria-hidden="true" />}
    >
      <Stack gap="xs" align="flex-start">
        <Text size="sm">{message}</Text>
        {detail && <Text size="sm">{detail}</Text>}
        {action &&
          (action.href !== undefined ? (
            <Button
              component={Link}
              href={action.href}
              size="xs"
              variant="light"
              color="red"
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ) : (
            <Button
              onClick={action.onClick}
              size="xs"
              variant="light"
              color="red"
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
      </Stack>
    </Alert>
  );
}
