# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary

- Added centralized TypeScript types for client data management in the dashboard
- Added API client functions for client CRUD operations

## Notes for internal team

- PVS-163 completed
- Created `lib/types/client.ts` with Client, Website, and related types
- Includes helper functions for display name and initials
- Foundational work for PVS-164, PVS-168, PVS-170
- PVS-164 completed
- Created `lib/api/clients.ts` with getClients, getClient, createClient, updateClient, deleteClient
- Includes convenience functions: getActiveClients, getClientCount

## Changed URLs

- https://www.pixelversestudios.io/dashboard/clients
