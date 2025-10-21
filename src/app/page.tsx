"use client";

import { DataTable } from "@/components/modules/data-table";
import { columns } from "@/components/modules/columns";
import { TableSkeleton } from "@/components/modules/table-skeleton";
import { useAdvocates } from "@/hooks/use-advocates";

export default function Home() {
  const { data: advocates, isLoading, isError, error } = useAdvocates();

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Solace Advocates</h1>
      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="text-center py-10 text-red-600">
          Error loading advocates: {error?.message}
        </div>
      ) : (
        <DataTable columns={columns} data={advocates || []} />
      )}
    </main>
  );
}
