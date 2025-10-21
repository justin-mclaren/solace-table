"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Check } from "lucide-react";

export interface AdvocateFilterState {
  cities: string[];
  degrees: string[];
  specialties: string[];
  experienceRanges: string[];
}

interface AdvocateFiltersProps {
  filters: AdvocateFilterState;
  onFiltersChange: (filters: AdvocateFilterState) => void;
  availableCities: string[];
  availableDegrees: string[];
  availableSpecialties: string[];
  className?: string;
}

// Multi-select popover component
interface MultiSelectPopoverProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  searchPlaceholder?: string;
}

function MultiSelectPopover({
  title,
  options,
  selectedValues,
  onSelectedValuesChange,
  searchPlaceholder = "Search...",
}: MultiSelectPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (value: string) => {
    const isSelected = selectedValues.includes(value);
    const newValues = isSelected
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectedValuesChange(newValues);
  };

  const clearAll = () => {
    onSelectedValuesChange([]);
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) {
      return title;
    } else if (selectedValues.length === 1) {
      return selectedValues[0];
    } else if (selectedValues.length <= 2) {
      return selectedValues.join(", ");
    } else {
      return `${selectedValues.length} selected`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-auto min-w-[140px] justify-between h-9 px-3 py-2"
        >
          <span className="truncate">{getDisplayValue()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        {/* Search */}
        <div className="p-3 border-b">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>

        {/* Selected count and clear */}
        {selectedValues.length > 0 && (
          <div className="p-2 border-b flex items-center justify-between bg-muted/50">
            <span className="text-xs text-muted-foreground">
              {selectedValues.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Options list */}
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  className={`relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-2 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground ${
                    selectedValues.includes(option) ? "font-medium" : ""
                  }`}
                  onClick={() => handleToggle(option)}
                >
                  <span className="flex-1 text-left">{option}</span>
                  {selectedValues.includes(option) && (
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Experience range options
const EXPERIENCE_RANGES = [
  { value: "0-5", label: "0-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "11-15", label: "11-15 years" },
  { value: "16-20", label: "16-20 years" },
  { value: "21+", label: "21+ years" },
];

export function AdvocateFilters({
  filters,
  onFiltersChange,
  availableCities,
  availableDegrees,
  availableSpecialties,
  className = "",
}: AdvocateFiltersProps) {
  // Update a specific filter
  const updateFilter = (key: keyof AdvocateFilterState, value: string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      cities: [],
      degrees: [],
      specialties: [],
      experienceRanges: [],
    });
  };

  // Count active filters
  const activeFilterCount =
    filters.cities.length +
    filters.degrees.length +
    filters.specialties.length +
    filters.experienceRanges.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-3 items-center">
        {/* City Filter */}
        <MultiSelectPopover
          title="City"
          options={availableCities}
          selectedValues={filters.cities}
          onSelectedValuesChange={(values) => updateFilter("cities", values)}
          searchPlaceholder="Search cities..."
        />

        {/* Degree Filter */}
        <MultiSelectPopover
          title="Degree"
          options={availableDegrees}
          selectedValues={filters.degrees}
          onSelectedValuesChange={(values) => updateFilter("degrees", values)}
          searchPlaceholder="Search degrees..."
        />

        {/* Specialties Filter */}
        <MultiSelectPopover
          title="Specialties"
          options={availableSpecialties}
          selectedValues={filters.specialties}
          onSelectedValuesChange={(values) =>
            updateFilter("specialties", values)
          }
          searchPlaceholder="Search specialties..."
        />

        {/* Experience Range Filter */}
        <MultiSelectPopover
          title="Experience"
          options={EXPERIENCE_RANGES.map((r) => r.label)}
          selectedValues={filters.experienceRanges}
          onSelectedValuesChange={(values) =>
            updateFilter("experienceRanges", values)
          }
          searchPlaceholder="Search ranges..."
        />

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="text-sm"
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
}
