'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EditClientModal } from '../../components/edit-client-modal';
import { DeleteClientDialog } from '../../components/delete-client-dialog';
import type { Client } from '@/lib/types/client';

interface ClientActionsProps {
  client: Client;
}

export function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    router.push('/dashboard/clients');
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Website
        </Button>
      </div>

      <EditClientModal
        client={client}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteClientDialog
        client={client}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
