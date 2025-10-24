"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AdvocateFilterState } from "../advocate-filters";
import { MainPage } from "./main-page";
import { CityPage } from "./city-page";
import { SpecialtyPage } from "./specialty-page";

interface MobileAdvocateFiltersProps {
  filters: AdvocateFilterState;
  onFiltersChange: (filters: AdvocateFilterState) => void;
  availableCities: string[];
  availableDegrees: string[];
  availableSpecialties: string[];
}

type FilterPage = "main" | "city" | "specialty";

export function MobileAdvocateFilters({
  filters,
  onFiltersChange,
  availableCities,
  availableDegrees,
  availableSpecialties,
}: MobileAdvocateFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<AdvocateFilterState>(filters);
  const [currentPage, setCurrentPage] = useState<FilterPage>("main");
  const [searchTerms, setSearchTerms] = useState({
    city: "",
    specialty: "",
  });

  // Count active filters (for badge on trigger button)
  const activeFilterCount =
    filters.cities.length +
    filters.degrees.length +
    filters.specialties.length +
    filters.experienceRanges.length;

  // Count temp filters (for display inside drawer)
  const tempActiveFilterCount =
    tempFilters.cities.length +
    tempFilters.degrees.length +
    tempFilters.specialties.length +
    tempFilters.experienceRanges.length;

  // Handle opening/closing
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempFilters(filters);
      setCurrentPage("main");
      setSearchTerms({ city: "", specialty: "" });
    }
    setIsOpen(open);
  };

  // Apply filters and close
  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters: AdvocateFilterState = {
      cities: [],
      degrees: [],
      specialties: [],
      experienceRanges: [],
    };
    setTempFilters(clearedFilters);
  };

  // Clear specific filter
  const handleClearCities = () => {
    setTempFilters((prev) => ({ ...prev, cities: [] }));
  };

  const handleClearSpecialties = () => {
    setTempFilters((prev) => ({ ...prev, specialties: [] }));
  };

  // Toggle selection
  const toggleSelection = (
    filterKey: keyof AdvocateFilterState,
    value: string
  ) => {
    setTempFilters((prev) => {
      const currentValues = prev[filterKey] as string[];
      const isSelected = currentValues.includes(value);
      const newValues = isSelected
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [filterKey]: newValues,
      };
    });
  };

  // Navigation
  const navigateToCity = () => setCurrentPage("city");
  const navigateToSpecialty = () => setCurrentPage("specialty");
  const navigateToMain = () => {
    setCurrentPage("main");
    // Clear search when going back
    setSearchTerms((prev) => ({ ...prev, city: "", specialty: "" }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="bottom">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 relative bg-white"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[calc(100dvh-80px)] max-h-[calc(100dvh-80px)] p-0 overflow-hidden">
        <div className="relative h-full overflow-hidden">
          {/* Main Page */}
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-300 ease-in-out",
              currentPage === "main" ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <MainPage
              tempFilters={tempFilters}
              availableDegrees={availableDegrees}
              activeFilterCount={tempActiveFilterCount}
              onToggleSelection={toggleSelection}
              onNavigateToCity={navigateToCity}
              onNavigateToSpecialty={navigateToSpecialty}
              onClearAll={handleClearAll}
              onApplyFilters={handleApplyFilters}
            />
          </div>

          {/* City Page */}
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-300 ease-in-out",
              currentPage === "city" ? "translate-x-0" : "translate-x-full"
            )}
          >
            <CityPage
              tempFilters={tempFilters}
              availableCities={availableCities}
              searchTerm={searchTerms.city}
              onSearchChange={(value) =>
                setSearchTerms((prev) => ({ ...prev, city: value }))
              }
              onToggleSelection={toggleSelection}
              onClearAll={handleClearCities}
              onNavigateBack={navigateToMain}
            />
          </div>

          {/* Specialty Page */}
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-300 ease-in-out",
              currentPage === "specialty" ? "translate-x-0" : "translate-x-full"
            )}
          >
            <SpecialtyPage
              tempFilters={tempFilters}
              availableSpecialties={availableSpecialties}
              searchTerm={searchTerms.specialty}
              onSearchChange={(value) =>
                setSearchTerms((prev) => ({ ...prev, specialty: value }))
              }
              onToggleSelection={toggleSelection}
              onClearAll={handleClearSpecialties}
              onNavigateBack={navigateToMain}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
