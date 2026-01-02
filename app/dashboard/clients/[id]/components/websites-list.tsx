'use client';

import { Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableWebsiteCard } from './editable-website-card';
import type { Website } from '@/lib/types/client';

interface WebsitesListProps {
  websites?: Website[];
  clientId: string;
}

export function WebsitesList({ websites, clientId }: WebsitesListProps) {
  const handleSave = async (updatedWebsite: Website) => {
    // TODO: Implement API call to save website
    // const response = await fetch(`/api/clients/${clientId}/websites/${updatedWebsite.id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(updatedWebsite),
    // })
  };

  const handleDelete = async (websiteId: string) => {
    // TODO: Implement API call to delete website
    // const response = await fetch(`/api/clients/${clientId}/websites/${websiteId}`, {
    //   method: 'DELETE',
    // })
  };

  return (
    <div>
      {/* Websites Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[var(--pv-primary)]" />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--pv-text)' }}>
            Websites
          </h2>
        </div>
        <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
          Manage and edit client websites. Click Edit to modify any website details.
        </p>
      </div>

      {/* Websites List */}
      {websites && websites.length > 0 ? (
        <div className="space-y-4">
          {websites.map((website) => (
            <EditableWebsiteCard
              key={website.id}
              website={website}
              clientId={clientId}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl border border-dashed p-12 text-center"
          style={{
            background: 'var(--pv-surface)',
            borderColor: 'var(--pv-border)',
          }}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: 'rgba(63, 0, 233, 0.1)',
            }}
          >
            <Globe className="h-8 w-8 text-[var(--pv-primary)]" />
          </div>
          <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--pv-text)' }}>
            No websites yet
          </h3>
          <p className="mb-4 text-sm text-[var(--pv-text-muted)]">
            Get started by adding this client&apos;s first website
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        </div>
      )}
    </div>
  );
}
