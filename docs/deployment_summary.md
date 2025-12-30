# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added centralized TypeScript types for client data management in the dashboard
- Added API client functions for client CRUD operations
- Added modal for creating new clients from the dashboard
- Added modal for editing existing client details
- Added delete confirmation dialog with cascade warnings
- Added inline Edit and Delete buttons to clients table with modal integration
- Added pagination controls to clients list page
- Added Edit and Delete actions to client detail page header
- Added project kanban card component for CRM board display
- Added client swimlane component for CRM kanban board
- Added CRM kanban board orchestrator for managing client projects

## Notes for internal team

- PVS-163 completed
- Created `lib/types/client.ts` with Client, Website, and related types
- Includes helper functions for display name and initials
- Foundational work for PVS-164, PVS-168, PVS-170
- PVS-164 completed
- Created `lib/api/clients.ts` with getClients, getClient, createClient, updateClient, deleteClient
- Includes convenience functions: getActiveClients, getClientCount
- PVS-165 completed
- Created `app/dashboard/clients/components/add-client-modal.tsx`
- Auto-generates slug from client name, validates required fields
- PVS-166 completed
- Created `app/dashboard/clients/components/edit-client-modal.tsx`
- Pre-fills form with client data, only sends changed fields in PATCH
- PVS-167 completed
- Created `app/dashboard/clients/components/delete-client-dialog.tsx`
- Added `destructive` variant to Button component
- Shows cascade warnings for websites that will be deleted
- PVS-168 completed
- Refactored `app/dashboard/clients/components/clients-table.tsx` to use centralized types
- Added inline Edit/Delete action buttons with modal integration
- PVS-169 completed
- Created `app/dashboard/clients/components/pagination.tsx`
- Updated `app/dashboard/clients/page.tsx` to use paginated API with URL-based navigation
- PVS-170 completed
- Created `app/dashboard/clients/[id]/components/client-actions.tsx` with Edit/Delete buttons
- Updated `app/dashboard/clients/[id]/page.tsx` to use getClient() API client
- Updated `app/dashboard/clients/[id]/components/client-info-sidebar.tsx` with client name, slug, CMS badge
- PVS-172 completed
- Created `lib/types/project.ts` with ProjectStatus, Project types, and status helpers
- Created `app/dashboard/clients/components/project-kanban-card.tsx` for CRM kanban board
- PVS-173 completed
- Created `app/dashboard/clients/components/client-swimlane.tsx`
- Collapsible swimlane with client header, contact info, and drag-and-drop drop zones
- Integrates with ProjectKanbanCard and @hello-pangea/dnd
- PVS-174 completed
- Created `app/dashboard/clients/components/crm-kanban-board.tsx`
- DragDropContext orchestrator with sticky column headers, status counts, and icons
- Optimistic drag-end updates with API rollback on error
- Created `lib/api/projects.ts` with updateProjectStatus and reorderProjects functions
- Supports visibleColumns prop to filter displayed status columns

## Changed URLs

- https://www.pixelversestudios.io/dashboard/clients
