import db from "@/db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { Advocate } from "@/types/advocate";

export async function POST() {
  const records: Advocate[] = await db
    .insert(advocates)
    .values(advocateData)
    .returning();

  return Response.json({ advocates: records });
}
