# Audit Log - Per-URL Indexing Update - 2025-11-23 21:06:56

## Prompt Summary

Backend migrated to track indexing status per individual URL instead of per deployment. This allows granular control over which specific URLs have been re-indexed in Google Search Console, rather than marking entire deployments as indexed/unindexed.

User provided updated API documentation showing the new response structure where `changed_urls` is now an array of objects with `url` and `indexed_at` fields, and deployment's `indexed_at` is set automatically when all URLs are indexed.

## Actions Taken

1. **Updated Type Definitions:**
   - Added `ChangedUrl` interface with `url` and `indexed_at` fields
   - Updated `Deployment` interface to use `ChangedUrl[]` instead of `string[]`
   - Added `'partial'` to `DeploymentStatus` type for partially-indexed deployments

2. **Enhanced DeploymentCard Component:**
   - Added per-URL status calculation (indexed/pending/partial)
   - Added visual status indicators (colored dots) for each URL
   - Updated URL list to show indexing progress (e.g., "3/5 indexed")
   - Color-coded URL borders based on status (emerald for indexed, amber for pending)
   - Maintained all existing functionality (copy, external links)

3. **Enhanced DeploymentStatusBadge Component:**
   - Added optional `indexedCount` and `totalCount` props
   - Added support for 'partial' status display
   - Shows progress ratio for partially-indexed deployments (e.g., "2/5 Indexed")
   - Maintains pulse animation for pending items

4. **Enhanced DeploymentsSection Component:**
   - Updated counting logic to track URLs instead of deployments
   - Shows total pending URLs across all deployments
   - Displays progress (e.g., "15/20 URLs have been indexed")
   - Improved status summary messaging

5. **Verified Compilation:**
   - Ran TypeScript compilation check (zero errors)

## Files Changed

### Modified Files

- `app/dashboard/clients/[id]/websites/[websiteId]/types.ts` - Added `ChangedUrl` interface, updated `Deployment` to use objects instead of strings
- `app/dashboard/clients/[id]/websites/[websiteId]/components/deployment-status-badge.tsx` - Added progress display support for partial status
- `app/dashboard/clients/[id]/websites/[websiteId]/components/deployment-card.tsx` - Added per-URL status indicators and progress tracking
- `app/dashboard/clients/[id]/websites/[websiteId]/components/deployments-section.tsx` - Updated URL counting logic and status messaging
- `docs/audits/landing/2025-11-23-21-06-56-per-url-indexing-update.md` - This audit file

## Components/Features Affected

### Type System Changes

**Before:**
```typescript
interface Deployment {
  changed_urls: string[]  // Just URL strings
  indexed_at: string | null
}
```

**After:**
```typescript
interface ChangedUrl {
  url: string
  indexed_at: string | null  // Per-URL indexing status
}

interface Deployment {
  changed_urls: ChangedUrl[]  // Objects with status
  indexed_at: string | null  // Auto-set when ALL urls indexed
}
```

### Visual Changes

1. **Deployment Status Badge:**
   - Now shows progress for partial status: "2/5 Indexed"
   - Maintains pulse animation for pending
   - Static for fully indexed

2. **URL List:**
   - Each URL has a colored status dot (emerald = indexed, amber = pending)
   - Border color matches status
   - Section header shows progress count: "Changed URLs (5) - 2/5 indexed"

3. **Status Summary Alert:**
   - Shows total pending URLs across all deployments
   - Example: "8 URLs pending indexing across 3 deployments"
   - Shows progress: "12/20 URLs have been indexed"

### Business Logic Changes

**Status Calculation:**
- `'indexed'`: All URLs have `indexed_at` timestamp (deployment.indexed_at !== null)
- `'partial'`: Some URLs indexed, some pending (indexedCount > 0 && !isFullyIndexed)
- `'pending'`: No URLs indexed yet (indexedCount === 0)

**Counting Logic:**
```javascript
// Total URLs across all deployments
const totalUrls = deployments.reduce((sum, d) => sum + d.changed_urls.length, 0)

// Pending URLs across all deployments
const pendingUrls = deployments.reduce(
  (sum, d) => sum + d.changed_urls.filter(u => !u.indexed_at).length,
  0
)

// Indexed URLs
const indexedUrls = totalUrls - pendingUrls
```

## API Response Changes

### Before Migration

```json
{
  "changed_urls": [
    "https://www.pixelversestudios.io/",
    "https://www.pixelversestudios.io/services"
  ],
  "indexed_at": "2025-11-21T09:15:00.000000+00:00"
}
```

### After Migration

```json
{
  "changed_urls": [
    {
      "url": "https://www.pixelversestudios.io/",
      "indexed_at": null
    },
    {
      "url": "https://www.pixelversestudios.io/services",
      "indexed_at": "2025-11-24T12:30:00.000000+00:00"
    }
  ],
  "indexed_at": null
}
```

**Key Difference:**
- `changed_urls` is now an array of **objects** (not strings)
- Each URL tracks its own `indexed_at` timestamp
- Deployment's `indexed_at` auto-updates when all URLs are indexed

## Testing Considerations

### Manual Testing Required

- [ ] Verify API returns new structure correctly
- [ ] Test display with fully indexed deployment (all URLs indexed)
- [ ] Test display with partially indexed deployment (some URLs indexed)
- [ ] Test display with pending deployment (no URLs indexed)
- [ ] Verify status badge shows correct label for each state
- [ ] Verify colored dots appear correctly per URL
- [ ] Verify URL count shows accurate ratio (X/Y indexed)
- [ ] Test status summary calculates totals correctly
- [ ] Verify copy-to-clipboard still works
- [ ] Test external link buttons still work

### Edge Cases

- [ ] Single URL deployment (fully indexed)
- [ ] Single URL deployment (pending)
- [ ] Many URLs (10+) with mixed statuses
- [ ] All deployments fully indexed (no alert shown)
- [ ] All URLs pending (alert shows correct count)

## Performance Impact

### Minimal Impact
- **Type changes**: No runtime overhead
- **Calculation logic**: Simple array filters/reduces (O(n) operations)
- **Rendering**: Same number of components, just with enhanced data display
- **Bundle size**: No new dependencies, ~50 lines of code added

## Benefits of Per-URL Indexing

1. **Granular Control:**
   - Mark individual URLs as indexed instead of all-or-nothing
   - Track progress as URLs are gradually re-indexed

2. **Better Visibility:**
   - Users can see which specific URLs need attention
   - Visual indicators make status immediately clear

3. **Improved Workflow:**
   - Partially complete deployments don't disappear from pending list
   - Progress tracking shows momentum toward completion

4. **Accurate Status:**
   - Deployment marked indexed only when truly complete
   - No confusion about which URLs still need work

## Future Enhancements

### Step 2: Mark URL as Indexed (Next)
- Add checkbox or button per URL to mark as indexed
- API: `POST /api/deployments/:id/urls/:url/index`
- Optimistic UI updates
- Toast notification on success

### Step 3: Bulk Operations
- Select multiple URLs to mark as indexed
- "Mark all as indexed" button for deployment
- Batch API request

### Step 4: Filtering
- Filter to show only pending URLs
- Filter to show only partial deployments
- Sort by most pending URLs

## Notes

### Design Decisions

1. **Progress in Badge:** For partial status, showing "2/5 Indexed" in badge provides immediate context without opening the deployment card.

2. **Color-Coded URLs:** Each URL has a status dot and border color so users can quickly scan which need attention, even when URLs are collapsed.

3. **Count in Section Header:** Adding "2/5 indexed" next to "Changed URLs (5)" provides progress context while maintaining the total count.

4. **Aggregated Alert:** Status summary shows total pending URLs across ALL deployments, giving a high-level view of remaining work.

### Technical Considerations

- **Backward Compatibility:** Type changes are breaking for the API response, but that's expected since this is a backend migration. All frontend code updated accordingly.

- **Auto-Update Logic:** Deployment's `indexed_at` is set by backend when last URL is marked, so frontend doesn't need to handle this calculation.

- **Client-side Filtering:** Documentation suggests filtering client-side, which is fine for now but could move to backend with query params if needed (e.g., `?status=pending`).

### Known Limitations

1. **No Real-time Updates:** If URLs are marked as indexed in another session, current view won't auto-refresh. Future: add polling or WebSocket.

2. **No Edit Capability Yet:** Users can view status but can't yet mark URLs as indexed from UI. This is intentional - Step 2 will add this.

3. **No Sorting:** Deployments show in chronological order. Could add sorting by "most pending URLs" or "newest pending URL".

## Timestamp

Created: 2025-11-23 21:06:56
Change Type: Backend Migration Adaptation
API Version: v2 (per-URL indexing)
Backward Compatible: No (breaking change in API response structure)
Frontend Updated: Yes
TypeScript Compilation: ✅ Success
