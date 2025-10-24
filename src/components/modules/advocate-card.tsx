"use client";

import { Advocate } from "@/types/advocate";
import Avvvatars from "avvvatars-react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
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

interface AdvocateCardProps {
  advocate: Advocate;
  onViewDetails: (advocate: Advocate) => void;
}

export function AdvocateCard({ advocate, onViewDetails }: AdvocateCardProps) {
  const initials = `${advocate.firstName[0]}${advocate.lastName[0]}`;
  const years = advocate.yearsOfExperience;
  const phoneNumber = advocate.phoneNumber
    .toString()
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const specialtiesText = advocate.specialties.join(", ");

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      {/* Header with Avatar and Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avvvatars
            value={`${advocate.firstName} ${advocate.lastName}`}
            displayValue={initials}
            size={40}
          />
          <div>
            <div className="font-medium">
              {advocate.firstName} {advocate.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{advocate.city}</div>
          </div>
        </div>
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
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground text-xs mb-1">Degree</div>
          <div className="font-medium">{advocate.degree}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs mb-1">Experience</div>
          <div className="font-medium">
            {years} {years === 1 ? "year" : "years"}
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="text-muted-foreground text-xs mb-1">Specialties</div>
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
      </div>

      {/* Phone Number */}
      <div>
        <div className="text-muted-foreground text-xs mb-1">Phone Number</div>
        <div className="text-sm font-mono">{phoneNumber}</div>
      </div>
    </div>
  );
}
