"use client";

import * as React from "react";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdvocateDetailsDialog } from "./advocate-details-dialog";
import { Advocate } from "@/types/advocate";

interface DesktopDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  totalCount?: number;
  onSort?: (sort: { sortBy: string; sortOrder: "asc" | "desc" }) => void;
  sortState?: { sortBy: string; sortOrder: "asc" | "desc" };
}

// Shared column styles for consistent header and body alignment
// Keyed by column ID to handle column visibility correctly
const COLUMN_STYLES: Record<string, React.CSSProperties> = {
  name: { flex: "2 1 0", minWidth: "150px" }, // Name - wider
  city: { flex: "1.5 1 0", minWidth: "120px" }, // City
  degree: { flex: "0.8 1 0", minWidth: "80px" }, // Degree - smaller
  specialties: {
    flex: "3 1 0",
    minWidth: "200px",
    maxWidth: "500px",
  }, // Specialties - most flexible
  yearsOfExperience: { flex: "1 1 0", minWidth: "100px" }, // Experience - smaller
  phoneNumber: { flex: "1.5 1 0", minWidth: "140px" }, // Phone Number
  actions: { flex: "0.5 0 0", minWidth: "60px" }, // Actions - smallest
};

export function DesktopDataTable<TData, TValue>({
  columns: baseColumns,
  data,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
  totalCount = 0,
  onSort,
  sortState,
}: DesktopDataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedAdvocate, setSelectedAdvocate] =
    React.useState<Advocate | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  const handleViewDetails = React.useCallback((advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setDialogOpen(true);
  }, []);

  const columns = React.useMemo(() => {
    // Check if columns is a function (factory) or array
    if (typeof baseColumns === "function") {
      return (baseColumns as any)(handleViewDetails, onSort, sortState);
    }
    return baseColumns;
  }, [baseColumns, handleViewDetails, onSort, sortState]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // CRITICAL: Use stable row IDs from database to prevent re-renders on page append
    getRowId: (row) => String((row as any).id),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
    // Server-side features
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true, // Using custom infinite scroll
    // Explicitly disable unused features for performance
    enableRowSelection: false,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    enableGrouping: false,
    enableExpanding: false,
    enableColumnPinning: false,
    enableRowPinning: false,
    enableGlobalFilter: false, // Using server-side search
  });

  const { rows } = table.getRowModel();

  // Add skeleton rows count
  const totalRows = rows.length + (isFetchingNextPage ? 5 : 0);

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 53, // Approximate row height in pixels
    overscan: 8,
  });

  // Infinite scroll with IntersectionObserver (better than scroll detection)
  const virtualItems = rowVirtualizer.getVirtualItems();

  React.useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore || isFetchingNextPage || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: tableContainerRef.current,
        rootMargin: "600px", // Start loading 200px before sentinel visible
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

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
        <div className="flex items-center justify-between py-4 px-4 md:px-0">
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
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          ref={tableContainerRef}
          className="rounded-md border bg-white"
          style={{ height: "calc(100vh - 350px)", overflow: "auto" }}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 border-b bg-white">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    style={{
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    {headerGroup.headers.map((header) => {
                      const style = COLUMN_STYLES[header.column.id];

                      return (
                        <TableHead key={header.id} style={style}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Body */}
          <Table>
            <TableBody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {virtualItems.map((virtualRow) => {
                    const isLoaderRow = virtualRow.index >= rows.length;

                    if (isLoaderRow) {
                      // Skeleton row
                      return (
                        <TableRow
                          key={`skeleton-${virtualRow.index}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                            display: "flex",
                            alignItems: "center",
                            // Performance: Isolate layout calculations
                            contain: "layout style paint",
                            // Performance: Hint browser about transform animations
                            willChange: "transform",
                          }}
                        >
                          <TableCell style={COLUMN_STYLES.name}>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-4 w-[120px]" />
                            </div>
                          </TableCell>
                          <TableCell style={COLUMN_STYLES.city}>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell style={COLUMN_STYLES.degree}>
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell style={COLUMN_STYLES.specialties}>
                            <Skeleton className="h-4 w-[200px]" />
                          </TableCell>
                          <TableCell style={COLUMN_STYLES.yearsOfExperience}>
                            <Skeleton className="h-4 w-[40px] mx-auto" />
                          </TableCell>
                          <TableCell style={COLUMN_STYLES.phoneNumber}>
                            <Skeleton className="h-4 w-[130px]" />
                          </TableCell>
                          <TableCell style={COLUMN_STYLES.actions}>
                            <Skeleton className="h-8 w-8" />
                          </TableCell>
                        </TableRow>
                      );
                    }

                    const row = rows[virtualRow.index];
                    return (
                      <TableRow
                        key={row.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          display: "flex",
                          alignItems: "center",
                          // Performance: Isolate layout calculations
                          contain: "layout style paint",
                          // Performance: Hint browser about transform animations
                          willChange: "transform",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const style = COLUMN_STYLES[cell.column.id];

                          return (
                            <TableCell key={cell.id} style={style}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>

          {/* Intersection Observer sentinel for infinite scroll */}
          {hasMore && (
            <div
              ref={loadMoreRef}
              style={{ height: "20px", visibility: "hidden" }}
              aria-hidden="true"
            />
          )}

          {/* End of list indicator */}
          {!isFetchingNextPage && !hasMore && rows.length > 0 && (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              All advocates loaded
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
