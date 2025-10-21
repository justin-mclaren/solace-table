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
      <div className="mb-6">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Filter dropdowns skeleton */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Skeleton className="h-9 w-[120px]" />
        <Skeleton className="h-9 w-[120px]" />
        <Skeleton className="h-9 w-[140px]" />
        <Skeleton className="h-9 w-[130px]" />
      </div>

      {/* Count and column selector row skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
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
                  <Skeleton className="h-4 w-[120px]" />
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

      {/* Loading indicator skeleton */}
      <div className="flex items-center justify-center py-4">
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
}
