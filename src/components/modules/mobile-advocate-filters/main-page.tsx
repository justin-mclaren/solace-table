"use client";

import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdvocateFilterState } from "../advocate-filters";

const EXPERIENCE_RANGES = [
  { value: "0-5", label: "0-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "11-15", label: "11-15 years" },
  { value: "16-20", label: "16-20 years" },
  { value: "21+", label: "21+ years" },
];

interface MainPageProps {
  tempFilters: AdvocateFilterState;
  availableDegrees: string[];
  activeFilterCount: number;
  onToggleSelection: (
    filterKey: keyof AdvocateFilterState,
    value: string
  ) => void;
  onNavigateToCity: () => void;
  onNavigateToSpecialty: () => void;
  onClearAll: () => void;
  onApplyFilters: () => void;
}

export function MainPage({
  tempFilters,
  availableDegrees,
  activeFilterCount,
  onToggleSelection,
  onNavigateToCity,
  onNavigateToSpecialty,
  onClearAll,
  onApplyFilters,
}: MainPageProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-sm"
          >
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* City - Navigable */}
        <div>
          <h3 className="font-medium mb-2">City</h3>
          <button
            onClick={onNavigateToCity}
            className="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-accent"
          >
            <span className="text-sm">
              {tempFilters.cities.length > 0
                ? `${tempFilters.cities.length} selected`
                : "Select cities"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Degree - Inline Pills */}
        <div>
          <h3 className="font-medium mb-2">Degree</h3>
          <div className="flex flex-wrap gap-2">
            {availableDegrees.map((degree) => {
              const isSelected = tempFilters.degrees.includes(degree);
              return (
                <button
                  key={degree}
                  onClick={() => onToggleSelection("degrees", degree)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-colors flex items-center gap-2",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white hover:bg-accent"
                  )}
                >
                  {degree}
                  {isSelected && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialties - Navigable */}
        <div>
          <h3 className="font-medium mb-2">Specialties</h3>
          <button
            onClick={onNavigateToSpecialty}
            className="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-accent"
          >
            <span className="text-sm">
              {tempFilters.specialties.length > 0
                ? `${tempFilters.specialties.length} selected`
                : "Select specialties"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Experience - Inline Pills */}
        <div>
          <h3 className="font-medium mb-2">Experience</h3>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_RANGES.map((range) => {
              const isSelected = tempFilters.experienceRanges.includes(
                range.value
              );
              return (
                <button
                  key={range.value}
                  onClick={() =>
                    onToggleSelection("experienceRanges", range.value)
                  }
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-colors flex items-center gap-2",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white hover:bg-accent"
                  )}
                >
                  {range.label}
                  {isSelected && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <Button onClick={onApplyFilters} className="w-full" size="lg">
          Show{" "}
          {activeFilterCount > 0 ? `(${activeFilterCount} filters)` : "Results"}
        </Button>
      </div>
    </div>
  );
}
