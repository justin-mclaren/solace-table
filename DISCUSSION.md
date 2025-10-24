# Performance & Caching Strategy

## Current Implementation (Read-Only Data)

Advocates data is currently read-only, enabling aggressive caching:

- **Next.js Data Cache**: `fetch()` calls use `next: { revalidate: false }` to cache indefinitely
- **React Query**: `staleTime: Infinity` for client-side cache
- **Cache Tags**: `"advocates"` and `"filter-options"` for future invalidation

## Future: When Data Becomes Mutable

When advocate CRUD operations are added, implement declarative cache invalidation:

```typescript
"use server";
import { revalidateTag } from "next/cache";

export async function updateAdvocate(id: number, data: AdvocateInput) {
  await db.update(advocates).set(data).where(eq(advocates.id, id));

  // Bust Next.js fetch cache
  revalidateTag("advocates");
  revalidateTag("filter-options"); // If cities/degrees/specialties changed

  // React Query will refetch automatically on next page visit
}
```

This ensures zero stale data while maintaining maximum performance for the read-heavy use case.
