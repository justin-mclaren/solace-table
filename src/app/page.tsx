"use client";

import { useMemo, useState, useEffect } from "react";
import { DataTable } from "@/components/modules/data-table";
import { columns } from "@/components/modules/columns";
import { TableSkeleton } from "@/components/modules/table-skeleton";
import { useAdvocates } from "@/hooks/use-advocates";
import { useFilterOptions } from "@/hooks/use-filter-options";
import {
  AdvocateFilters,
  AdvocateFilterState,
} from "@/components/modules/advocate-filters";
import { MobileAdvocateFilters } from "@/components/modules/mobile-advocate-filters";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter state
  const [filters, setFilters] = useState<AdvocateFilterState>({
    cities: [],
    degrees: [],
    specialties: [],
    experienceRanges: [],
  });

  // Fetch advocates with filters and search applied at the API level
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalCount,
  } = useAdvocates({
    search: debouncedSearch,
    ...filters,
  });

  // Flatten the paginated data
  const advocates = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Fetch filter options from dedicated endpoint
  const { data: filterOptions } = useFilterOptions();

  const availableCities = filterOptions?.cities || [];
  const availableDegrees = filterOptions?.degrees || [];
  const availableSpecialties = filterOptions?.specialties || [];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto pt-10 pb-10">
        {/* <h1 className="text-4xl font-bold mb-8">Solace Advocates</h1> */}

        {isError ? (
          <div className="text-center py-10 text-red-600">
            Error loading advocates: {error?.message}
          </div>
        ) : isLoading && !data ? (
          <TableSkeleton />
        ) : (
          <>
            {/* Search Input */}
            <div className="relative mb-6 max-w-3xl px-4 md:px-0">
              <Search className="absolute left-8 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search advocates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10 h-12 rounded-full bg-white"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-6 md:right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Mobile Filters */}
            <div className="md:hidden mb-6 px-4">
              <MobileAdvocateFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCities={availableCities}
                availableDegrees={availableDegrees}
                availableSpecialties={availableSpecialties}
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:block">
              <AdvocateFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCities={availableCities}
                availableDegrees={availableDegrees}
                availableSpecialties={availableSpecialties}
                className="mb-6"
              />
            </div>

            {/* Data Table */}
            <DataTable
              columns={columns}
              data={advocates}
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              totalCount={totalCount}
            />
          </>
        )}
      </div>
    </main>
  );
}
