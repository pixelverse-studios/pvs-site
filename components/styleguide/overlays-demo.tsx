'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { Modal } from '@/components/ui/modal';

export function OverlaysDemo() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setModalOpen(true)}>Launch modal</Button>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Launch drawer
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        title="Stay in the loop"
        description="Modals are surfaced with a dimmed overlay, focus management, and motion-safe transitions."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Dismiss
            </Button>
            <Button onClick={() => setModalOpen(false)}>Join the list</Button>
          </>
        }
      >
        We share monthly updates on new PixelVerse world drops, live events, and ecosystem features. Toggle the
        theme to preview accessibility in both modes.
      </Modal>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
        title="Creator tools"
        description="Drawers slide in from the edge and stay anchored to layout padding."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setDrawerOpen(false)}>Open dashboard</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>
            Build journeys, configure drops, and measure performance inside the creator dashboard. Drawers support
            overflow content and action footers.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--pv-text-muted)]">
            <li>Surface contextual workflows without navigating away.</li>
            <li>Maintain keyboard focus and escape support with accessible controls.</li>
            <li>Respect reduced motion preferences with subtle translations.</li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
}
