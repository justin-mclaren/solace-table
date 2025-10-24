"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Advocate } from "@/types/advocate";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Avvvatars from "avvvatars-react";

export const createColumns = (
  onViewDetails: (advocate: Advocate) => void,
  onSort?: (sort: { sortBy: string; sortOrder: "asc" | "desc" }) => void,
  sortState?: { sortBy: string; sortOrder: "asc" | "desc" }
): ColumnDef<Advocate>[] => [
  {
    id: "name",
    accessorKey: "lastName",
    header: () => {
      const isSorted = sortState?.sortBy === "lastName";
      const isAsc = isSorted && sortState?.sortOrder === "asc";
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() =>
            onSort?.({
              sortBy: "lastName",
              sortOrder: isAsc ? "desc" : "asc",
            })
          }
        >
          Name
          {isSorted ? (
            isAsc ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const advocate = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avvvatars
            value={`${advocate.firstName} ${advocate.lastName}`}
            displayValue={advocate.initials}
            size={32}
          />
          <span className="font-medium">
            {advocate.firstName} {advocate.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: () => {
      const isSorted = sortState?.sortBy === "city";
      const isAsc = isSorted && sortState?.sortOrder === "asc";
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() =>
            onSort?.({
              sortBy: "city",
              sortOrder: isAsc ? "desc" : "asc",
            })
          }
        >
          City
          {isSorted ? (
            isAsc ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "degree",
    header: () => {
      const isSorted = sortState?.sortBy === "degree";
      const isAsc = isSorted && sortState?.sortOrder === "asc";
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() =>
            onSort?.({
              sortBy: "degree",
              sortOrder: isAsc ? "desc" : "asc",
            })
          }
        >
          Degree
          {isSorted ? (
            isAsc ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("degree")}</div>,
  },
  {
    accessorKey: "specialties",
    header: () => {
      return <div className="flex items-center h-10">Specialties</div>;
    },
    cell: ({ row }) => {
      const advocate = row.original;
      const specialtiesText = advocate.specialties.join(", ");

      return (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div
              className="text-sm overflow-hidden whitespace-nowrap cursor-pointer"
              style={{ textOverflow: "ellipsis" }}
            >
              {specialtiesText}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-md">
            <div className="flex flex-col gap-1">
              {advocate.specialties.map((specialty, index) => (
                <div key={index} className="text-sm">
                  {specialty}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "yearsOfExperience",
    header: () => {
      const isSorted = sortState?.sortBy === "yearsOfExperience";
      const isAsc = isSorted && sortState?.sortOrder === "asc";
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() =>
            onSort?.({
              sortBy: "yearsOfExperience",
              sortOrder: isAsc ? "desc" : "asc",
            })
          }
        >
          Experience
          {isSorted ? (
            isAsc ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const years = row.getValue("yearsOfExperience") as number;
      return (
        <div className="md:text-center text-left">
          {years} {years === 1 ? "year" : "years"}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => {
      return <div className="flex items-center h-10">Phone Number</div>;
    },
    cell: ({ row }) => {
      const advocate = row.original;
      return <div className="font-mono">{advocate.formattedPhoneNumber}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const advocate = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(advocate.id.toString());
                toast.success("Advocate ID copied to clipboard");
              }}
            >
              Copy advocate ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(advocate)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `tel:${advocate.phoneNumber}`;
              }}
            >
              Contact advocate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
