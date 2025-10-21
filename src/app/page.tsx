"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import { DataTable } from "@/components/modules/data-table";
import { columns } from "@/components/modules/columns";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching advocates:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Solace Advocates</h1>
      {isLoading ? (
        <div className="text-center py-10">Loading advocates...</div>
      ) : (
        <DataTable columns={columns} data={advocates} />
      )}
    </main>
  );
}
