import { useQuery, useQueryClient } from "@tanstack/react-query";

interface FilterOptions {
  cities: string[];
  degrees: string[];
  specialties: string[];
}

async function fetchFilterOptions(): Promise<FilterOptions> {
  const response = await fetch("/api/advocates/filters");

  if (!response.ok) {
    throw new Error("Failed to fetch filter options");
  }

  return response.json();
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: fetchFilterOptions,
    // Filter options are static during a session (derived from advocates table)
    // Only change when advocates are added/updated/deleted
    staleTime: Infinity, // Never consider stale - rely on manual invalidation
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists
  });
}

/**
 * Invalidate filter options cache
 * Call this after mutations that affect advocate data (add/edit/delete)
 *
 * Example usage:
 * ```ts
 * const invalidateFilters = useInvalidateFilterOptions();
 *
 * // After creating/updating/deleting an advocate:
 * await createAdvocate(data);
 * invalidateFilters(); // Refetch filter options
 * ```
 */
export function useInvalidateFilterOptions() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["filter-options"] });
  };
}
