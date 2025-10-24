"use client";

import { ChevronLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { AdvocateFilterState } from "../advocate-filters";

interface SpecialtyPageProps {
  tempFilters: AdvocateFilterState;
  availableSpecialties: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleSelection: (
    filterKey: keyof AdvocateFilterState,
    value: string
  ) => void;
  onClearAll: () => void;
  onNavigateBack: () => void;
}

export function SpecialtyPage({
  tempFilters,
  availableSpecialties,
  searchTerm,
  onSearchChange,
  onToggleSelection,
  onClearAll,
  onNavigateBack,
}: SpecialtyPageProps) {
  const filteredSpecialties = availableSpecialties.filter((specialty) =>
    specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = tempFilters.specialties.length;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-sm"
            >
              Clear ({selectedCount})
            </Button>
          )}
        </div>
        <DrawerTitle className="text-lg font-semibold mb-3">
          Specialties
        </DrawerTitle>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search specialties..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-8"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredSpecialties.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No specialties found
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredSpecialties.map((specialty) => {
              const isSelected = tempFilters.specialties.includes(specialty);
              return (
                <button
                  key={specialty}
                  onClick={() => onToggleSelection("specialties", specialty)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent transition-colors",
                    isSelected && "bg-accent/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm text-left truncate",
                      isSelected && "font-medium"
                    )}
                  >
                    {specialty}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
