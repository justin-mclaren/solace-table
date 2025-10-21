import { useInfiniteQuery } from "@tanstack/react-query";
import { Advocate } from "@/types/advocate";

interface AdvocatesResponse {
  data: Advocate[];
  nextPage?: number;
  hasMore: boolean;
}

async function fetchAdvocates({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<AdvocatesResponse> {
  const response = await fetch(`/api/advocates?page=${pageParam}&limit=20`);

  if (!response.ok) {
    throw new Error("Failed to fetch advocates");
  }

  return response.json();
}

export function useAdvocates() {
  return useInfiniteQuery({
    queryKey: ["advocates"],
    queryFn: fetchAdvocates,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}
