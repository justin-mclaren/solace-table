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
      {/* Filter inputs skeleton */}
      <div className="flex items-center py-4 gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px] ml-auto" />
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
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-[90px]" />
                    <Skeleton className="h-3 w-[110px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[40px] mx-auto" />
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
