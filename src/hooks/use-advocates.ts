import { useQuery } from "@tanstack/react-query";
import { Advocate } from "@/types/advocate";

interface AdvocatesResponse {
  data: Advocate[];
}

async function fetchAdvocates(): Promise<Advocate[]> {
  const response = await fetch("/api/advocates");

  if (!response.ok) {
    throw new Error("Failed to fetch advocates");
  }

  const json: AdvocatesResponse = await response.json();
  return json.data;
}

export function useAdvocates() {
  return useQuery({
    queryKey: ["advocates"],
    queryFn: fetchAdvocates,
  });
}
