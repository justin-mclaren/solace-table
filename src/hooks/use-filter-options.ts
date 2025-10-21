import { useQuery } from "@tanstack/react-query";

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
    staleTime: 5 * 60 * 1000, // 5 minutes - filter options rarely change
  });
}
