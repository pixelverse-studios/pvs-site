'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { deleteClient } from '@/lib/api/clients';
import type { Client } from '@/lib/types/client';

interface DeleteClientDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteClientDialog({
  client,
  open,
  onOpenChange,
  onSuccess,
}: DeleteClientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const websiteCount = client.websites?.length ?? 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteClient(client.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Delete Client</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="pt-4 text-[var(--pv-text-muted)]">
              <p>
                Are you sure you want to delete{' '}
                <strong className="text-[var(--pv-text)]">{client.client}</strong>?
              </p>

              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <p className="font-medium text-red-400">This action cannot be undone.</p>
                <p className="mt-2 text-sm">The following will be permanently deleted:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>Client record and all contact information</li>
                  {websiteCount > 0 && (
                    <li>
                      {websiteCount} associated website{websiteCount !== 1 ? 's' : ''}
                    </li>
                  )}
                  <li>All related deployments and SEO data</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Permanently'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
