"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/modules/data-table";
import { columns } from "@/components/modules/columns";
import { TableSkeleton } from "@/components/modules/table-skeleton";
import { useAdvocates } from "@/hooks/use-advocates";
import {
  AdvocateFilters,
  AdvocateFilterState,
} from "@/components/modules/advocate-filters";

export default function Home() {
  // Filter state
  const [filters, setFilters] = useState<AdvocateFilterState>({
    cities: [],
    degrees: [],
    specialties: [],
    experienceRanges: [],
  });

  // Fetch advocates with filters applied at the API level
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalCount,
  } = useAdvocates(filters);

  // Flatten the paginated data
  const advocates = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // For getting all unique values, we need to fetch without filters
  // We'll use a separate query just for getting the filter options
  const { data: allData } = useAdvocates({
    cities: [],
    degrees: [],
    specialties: [],
    experienceRanges: [],
  });

  // Extract unique values for filter options from unfiltered data
  const { availableCities, availableDegrees, availableSpecialties } =
    useMemo(() => {
      const allAdvocates = allData?.pages.flatMap((page) => page.data) || [];
      const cities = new Set<string>();
      const degrees = new Set<string>();
      const specialties = new Set<string>();

      allAdvocates.forEach((advocate) => {
        cities.add(advocate.city);
        degrees.add(advocate.degree);
        advocate.specialties.forEach((specialty) => specialties.add(specialty));
      });

      return {
        availableCities: Array.from(cities).sort(),
        availableDegrees: Array.from(degrees).sort(),
        availableSpecialties: Array.from(specialties).sort(),
      };
    }, [allData]);

  return (
    <main className="container mx-auto pt-10">
      <h1 className="text-4xl font-bold mb-8">Solace Advocates</h1>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="text-center py-10 text-red-600">
          Error loading advocates: {error?.message}
        </div>
      ) : (
        <>
          {/* Filters */}
          <AdvocateFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCities={availableCities}
            availableDegrees={availableDegrees}
            availableSpecialties={availableSpecialties}
            className="mb-6"
          />

          {/* Results count */}
          <div className="mb-4 text-sm text-muted-foreground">
            {totalCount} advocates found
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={advocates}
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </main>
  );
}
