'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

export function OverlaysDemo() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setDialogOpen(true)}>Launch modal</Button>
        <Button variant="secondary" onClick={() => setSheetOpen(true)}>
          Launch drawer
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stay in the loop</DialogTitle>
            <DialogDescription>
              Modals are surfaced with a dimmed overlay, focus management, and motion-safe transitions.
            </DialogDescription>
          </DialogHeader>
          <div className="text-base text-[var(--pv-text)]">
            We share monthly updates on new PixelVerse world drops, live events, and ecosystem features. Toggle the theme
            to preview accessibility in both modes.
          </div>
          <DialogFooter className="sm:flex-row sm:space-x-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Dismiss
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Join the list</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Creator tools</SheetTitle>
            <SheetDescription>
              Drawers slide in from the edge and stay anchored to layout padding.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 text-base text-[var(--pv-text)]">
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
          <SheetFooter>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setSheetOpen(false)}>Open dashboard</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
