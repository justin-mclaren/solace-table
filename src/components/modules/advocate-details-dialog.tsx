"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Avvvatars from "avvvatars-react";
import { Advocate } from "@/types/advocate";

interface AdvocateDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advocate: Advocate | null;
}

export function AdvocateDetailsDialog({
  open,
  onOpenChange,
  advocate,
}: AdvocateDetailsDialogProps) {
  if (!advocate) return null;

  const initials = `${advocate.firstName[0]}${advocate.lastName[0]}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
}
