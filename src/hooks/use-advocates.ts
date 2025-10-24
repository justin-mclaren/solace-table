import { useInfiniteQuery } from "@tanstack/react-query";
import { Advocate } from "@/types/advocate";
import { useMemo } from "react";

interface AdvocatesResponse {
  data: Advocate[];
  nextPage?: number;
  hasMore: boolean;
  total: number;
}

export interface AdvocateFilters {
  search?: string;
  cities: string[];
  degrees: string[];
  specialties: string[];
  experienceRanges: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

async function fetchAdvocates({
  pageParam = 1,
  filters,
}: {
  pageParam?: number;
  filters: AdvocateFilters;
}): Promise<AdvocatesResponse> {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: "20",
  });

  // Add search parameter
  if (filters.search) {
    params.append("search", filters.search);
  }

  // Add filter parameters
  if (filters.cities.length > 0) {
    params.append("cities", filters.cities.join(","));
  }
  if (filters.degrees.length > 0) {
    params.append("degrees", filters.degrees.join(","));
  }
  if (filters.specialties.length > 0) {
    params.append("specialties", filters.specialties.join(","));
  }
  if (filters.experienceRanges.length > 0) {
    params.append("experienceRanges", filters.experienceRanges.join(","));
  }

  // Add sort parameters
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }

  const response = await fetch(`/api/advocates?${params.toString()}`, {
    // ✅ AGGRESSIVE NEXT.JS CACHING: Cache forever (data is read-only)
    next: {
      revalidate: false, // Never auto-revalidate (cache indefinitely)
      tags: ["advocates"], // For future cache invalidation
    },
    // 🔮 FUTURE: When advocates can be updated:
    // next: { revalidate: 3600, tags: ["advocates"] } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch advocates");
  }

  return response.json();
}

export function useAdvocates(
  filters: AdvocateFilters = {
    search: "",
    cities: [],
    degrees: [],
    specialties: [],
    experienceRanges: [],
    sortBy: "lastName",
    sortOrder: "asc",
  }
) {
  const query = useInfiniteQuery({
    queryKey: ["advocates", filters],
    queryFn: ({ pageParam }) => fetchAdvocates({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    placeholderData: (previousData) => previousData,
  });

  // Get total count from the first page response
  const totalCount = useMemo(() => {
    return query.data?.pages[0]?.total ?? 0;
  }, [query.data?.pages]);

  return {
    ...query,
    totalCount,
  };
}
