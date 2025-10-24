"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdvocateCard } from "./advocate-card";
import { AdvocateDetailsDialog } from "./advocate-details-dialog";
import { Advocate } from "@/types/advocate";

interface MobileDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  totalCount?: number;
}

export function MobileDataTable<TData = unknown, TValue = unknown>({
  data,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
  totalCount = 0,
}: MobileDataTableProps<TData, TValue>) {
  const loadTriggerRef = React.useRef<HTMLDivElement>(null);
  const [selectedAdvocate, setSelectedAdvocate] =
    React.useState<Advocate | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleViewDetails = React.useCallback((advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setDialogOpen(true);
  }, []);

  // Memoize cards to prevent re-creating them on every render
  const cards = React.useMemo(() => {
    return data.map((item) => (
      <AdvocateCard
        key={(item as Advocate).id}
        advocate={item as Advocate}
        onViewDetails={handleViewDetails}
      />
    ));
  }, [data, handleViewDetails]);

  // Infinite scroll with Intersection Observer
  React.useEffect(() => {
    const trigger = loadTriggerRef.current;
    if (!trigger || !hasMore || isFetchingNextPage || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetchingNextPage, onLoadMore]);

  return (
    <TooltipProvider>
      <div className="w-full">
        <AdvocateDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          advocate={selectedAdvocate}
        />
        <div className="flex items-center justify-between py-4 px-4">
          <div className="text-sm text-muted-foreground">
            {totalCount} advocates found
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem disabled>
                Column visibility not available on mobile
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="space-y-3 px-4"
          style={{ height: "calc(100vh - 315px)", overflow: "auto" }}
        >
          {data.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No results.
            </div>
          ) : (
            <>
              {cards}

              {isFetchingNextPage && (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="bg-white rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Intersection Observer trigger */}
              {hasMore && <div ref={loadTriggerRef} className="h-4" />}

              {!hasMore && data.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  All advocates loaded
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
