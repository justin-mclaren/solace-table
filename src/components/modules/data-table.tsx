"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const { rows } = table.getRowModel();

  // Add skeleton rows count
  const totalRows = rows.length + (isFetchingNextPage ? 5 : 0);

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 53, // Approximate row height in pixels
    overscan: 10, // Render 10 extra rows above and below viewport
  });

  // Infinite scroll based on scroll position
  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= rows.length - 1 &&
      hasMore &&
      !isFetchingNextPage &&
      onLoadMore
    ) {
      onLoadMore();
    }
  }, [
    hasMore,
    isFetchingNextPage,
    onLoadMore,
    rows.length,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by specialties..."
          value={
            (table.getColumn("specialties")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("specialties")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
        className="rounded-md border"
        style={{ height: "calc(100vh - 250px)", overflow: "auto" }}
      >
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-10 border-b"
          style={{
            backgroundColor: "hsl(var(--background))",
          }}
        >
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
                  {headerGroup.headers.map((header, index) => {
                    // Flex ratios and min widths for responsive columns
                    const columnStyles = {
                      0: { flex: "2 1 0", minWidth: "150px" }, // Name - wider
                      1: { flex: "1.5 1 0", minWidth: "120px" }, // City
                      2: { flex: "0.8 1 0", minWidth: "80px" }, // Degree - smaller
                      3: {
                        flex: "3 1 0",
                        minWidth: "200px",
                        maxWidth: "500px",
                      }, // Specialties - most flexible
                      4: { flex: "1 1 0", minWidth: "100px" }, // Years of Experience - smaller
                      5: { flex: "1.5 1 0", minWidth: "140px" }, // Phone Number
                      6: { flex: "0.5 0 0", minWidth: "60px" }, // Actions - smallest
                    };

                    const style =
                      columnStyles[index as keyof typeof columnStyles];

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
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
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
                        }}
                      >
                        <TableCell style={{ flex: "2 1 0", minWidth: "150px" }}>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell
                          style={{ flex: "1.5 1 0", minWidth: "120px" }}
                        >
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell
                          style={{ flex: "0.8 1 0", minWidth: "80px" }}
                        >
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell
                          style={{
                            flex: "3 1 0",
                            minWidth: "200px",
                            maxWidth: "500px",
                          }}
                        >
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell style={{ flex: "1 1 0", minWidth: "100px" }}>
                          <Skeleton className="h-4 w-[40px] mx-auto" />
                        </TableCell>
                        <TableCell
                          style={{ flex: "1.5 1 0", minWidth: "140px" }}
                        >
                          <Skeleton className="h-4 w-[130px]" />
                        </TableCell>
                        <TableCell
                          style={{ flex: "0.5 0 0", minWidth: "60px" }}
                        >
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
                      }}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        // Match header flex ratios and min widths
                        const columnStyles = {
                          0: { flex: "2 1 0", minWidth: "150px" }, // Name - wider
                          1: { flex: "1.5 1 0", minWidth: "120px" }, // City
                          2: { flex: "0.8 1 0", minWidth: "80px" }, // Degree - smaller
                          3: {
                            flex: "3 1 0",
                            minWidth: "200px",
                            maxWidth: "500px",
                          }, // Specialties - most flexible
                          4: { flex: "1 1 0", minWidth: "100px" }, // Years of Experience - smaller
                          5: { flex: "1.5 1 0", minWidth: "140px" }, // Phone Number
                          6: { flex: "0.5 0 0", minWidth: "60px" }, // Actions - smallest
                        };

                        const style =
                          columnStyles[index as keyof typeof columnStyles];

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

        {/* End of list indicator */}
        {!isFetchingNextPage && !hasMore && rows.length > 0 && (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            All advocates loaded
          </div>
        )}
      </div>
    </div>
  );
}
