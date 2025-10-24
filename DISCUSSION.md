# Caching Strategy

My favorite feature of Next.js is its fetch caching with deterministic cache busting. You get the performance of cached data with the immediacy of real-time updates. It's the best of both worlds.

## Current Setup (Read-Only)

Right now, advocates are read-only, so we cache everything indefinitely:

- **Next.js Data Cache**: All `fetch()` calls use `next: { revalidate: false, tags: [...] }`
- **React Query**: Client-side cache with `staleTime: Infinity`
- **Result**: Zero database queries after first load, instant UI

Since there's no way for data to change, there's never a point to invalidate the cache.

## Future: Adding Mutations

When we add update routes, cache invalidation is trivial - just call `revalidateTag()`:

```typescript
"use server";
import { revalidateTag } from "next/cache";

export async function updateAdvocate(id: number, data: AdvocateInput) {
  await db.update(advocates).set(data).where(eq(advocates.id, id));

  // Declaratively bust the cache
  revalidateTag("advocates");
  revalidateTag("filter-options"); // If cities/degrees/specialties changed
}
```

Every fetch tagged with `"advocates"` gets invalidated.

# CI & Static Analysis from Day One

I'm a huge fan of static analysis, but it's only beneficial when enforced. By adding linting, formatting, and type checking from the start, you maintain a production-ready main branch. In the past this was essential for scaling out a project to other developers. Now the same is true for scaling a project with AI agents.

Static analysis gives agents instant feedback and prevents a whole class of errors - coding mistakes and anti-patterns never enter your codebase. The process for managing a team of developers through CI/CD and code reviews applies equally to working with AI agents. They need the same guardrails.

## Next Step: Automated Testing

The next step would be to add automated testing to the pipeline:

- **Unit tests**: Database queries return correct results, filters work as expected
- **Integration tests**: API endpoints handle edge cases, pagination doesn't duplicate records
- **E2E tests**: Infinite scroll loads data, search updates the list, mobile layout renders correctly

Same principle applies - tests give developers and AI agents immediate feedback when they break something. The difference is tests catch logic errors that static analysis can't.

# UX Decisions

## Desktop: Scannable at a Glance

I tried to minimize the amount of upfront data shown to users so they can quickly identify the differences between advocates. The table shows just the essentials - name, location, credentials, specialties, and experience. Intuitive popovers and dialogs let users dig deeper into individual advocates when they find someone interesting.

Since the list will scale to hundreds of thousands of advocates, the major feature is searching and filtering to narrow things down. I added popover filters with search for the longer lists. In the future I'd like to add a draggable slider for experience and map based selector for "City". In the past I've built a really cool one for selecting states that I'd be happy to share.

## Mobile: Vertical Cards & Thumb-Friendly Filters

Tables don't really work on phone-sized screens, so my favorite option is switching to vertical cards. Each advocate gets their own card with the data stacked vertically.

Filtering becomes even more important when you can only see individual advocates at a time. I added mobile-specific filters designed for single-thumb use. They're easy to access and don't require precision tapping or two-handed interaction.

In order to make it easy to demo the mobile experience especially, I've hosted this project here: https://solace-table.vercel.app/

Scan the QR code below to check it out on your phone:

<p align="center">
  <img src="https://solace-table.vercel.app/solace-qr-code.png" alt="QR Code for Solace Table Demo" width="300"/>
</p>
