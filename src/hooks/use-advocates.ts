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
  cities: string[];
  degrees: string[];
  specialties: string[];
  experienceRanges: string[];
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

  const response = await fetch(`/api/advocates?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch advocates");
  }

  return response.json();
}

export function useAdvocates(
  filters: AdvocateFilters = {
    cities: [],
    degrees: [],
    specialties: [],
    experienceRanges: [],
  }
) {
  const query = useInfiniteQuery({
    queryKey: ["advocates", filters],
    queryFn: ({ pageParam }) => fetchAdvocates({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
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
