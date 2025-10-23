"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Avvvatars from "avvvatars-react";

export const columns: ColumnDef<Advocate>[] = [
  {
    id: "name",
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const advocate = row.original;
      const initials = `${advocate.firstName[0]}${advocate.lastName[0]}`;
      return (
        <div className="flex items-center gap-3">
          <Avvvatars
            value={`${advocate.firstName} ${advocate.lastName}`}
            displayValue={initials}
            size={32}
          />
          <span className="font-medium">
            {advocate.firstName} {advocate.lastName}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const advocate = row.original;
      const fullName =
        `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "degree",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Degree
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
      const specialties = row.getValue("specialties") as string[];
      const specialtiesText = specialties.join(", ");

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
              {specialties.map((specialty, index) => (
                <div key={index} className="text-sm">
                  {specialty}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
    filterFn: (row, id, value) => {
      const specialties = row.getValue(id) as string[];
      return specialties.some((specialty) =>
        specialty.toLowerCase().includes(value.toLowerCase())
      );
    },
  },
  {
    accessorKey: "yearsOfExperience",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-10 px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const years = row.getValue("yearsOfExperience") as number;
      return (
        <div className="text-center">
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
      const phoneNumber = row.getValue("phoneNumber") as number;
      // Format phone number (assuming US format)
      const formatted = phoneNumber
        .toString()
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      return <div className="font-mono">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const advocate = row.original;
      const initials = `${advocate.firstName[0]}${advocate.lastName[0]}`;

      return (
        <Dialog>
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
              <DialogTrigger asChild>
                <DropdownMenuItem>View details</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `tel:${advocate.phoneNumber}`;
                }}
              >
                Contact advocate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <Avvvatars
                  value={`${advocate.firstName} ${advocate.lastName}`}
                  displayValue={initials}
                  size={80}
                />
                <div className="flex-1">
                  <DialogTitle className="text-2xl">
                    {advocate.firstName} {advocate.lastName}
                  </DialogTitle>
                  <DialogDescription>
                    {advocate.degree} • {advocate.yearsOfExperience}{" "}
                    {advocate.yearsOfExperience === 1 ? "year" : "years"} of
                    experience
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Location
                </h4>
                <p className="text-base">{advocate.city}</p>
              </div>
              <div className="grid gap-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Phone Number
                </h4>
                <p className="text-base font-mono">
                  {advocate.phoneNumber
                    .toString()
                    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                </p>
              </div>
              <div className="grid gap-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Specialties
                </h4>
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2">
                  {advocate.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="w-fit text-sm py-1.5"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  window.location.href = `tel:${advocate.phoneNumber}`;
                }}
                className="w-full sm:w-auto"
              >
                Contact Advocate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
