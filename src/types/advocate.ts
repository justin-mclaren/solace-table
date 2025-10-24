import { InferSelectModel } from "drizzle-orm";
import { advocates } from "@/db/schema";

type AdvocateBase = InferSelectModel<typeof advocates>;

export type Advocate = Omit<AdvocateBase, "specialties"> & {
  specialties: string[];
  // Computed fields from API
  initials: string;
  formattedPhoneNumber: string;
};
