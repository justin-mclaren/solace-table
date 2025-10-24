import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
  return (
    <div className="w-full">
      {/* Search input skeleton */}
      <div className="mb-6 max-w-3xl px-4 md:px-0">
        <Skeleton className="h-12 w-full rounded-full" />
      </div>

      {/* Filter dropdowns skeleton - mobile shows button, desktop shows filters */}
      <div className="mb-6 px-4 md:px-0">
        <div className="md:hidden">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="hidden md:flex flex-wrap gap-3 items-center">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[130px]" />
        </div>
      </div>

      {/* Count and column selector row skeleton */}
      <div className="flex items-center justify-between py-4 px-4 md:px-0">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>

      {/* Mobile Card Skeletons */}
      <div className="md:hidden space-y-3 px-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border p-4 space-y-3">
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
      </div>

      {/* Desktop Table skeleton */}
      <div className="hidden md:block rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-8 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[90px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[150px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-8 w-[120px]" />
              </TableHead>
              <TableHead className="w-[50px]">
                <Skeleton className="h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px] mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[130px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
