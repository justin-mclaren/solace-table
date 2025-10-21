import db from "@/db";
import { advocates } from "@/db/schema";
import { Advocate } from "@/types/advocate";

export async function GET() {
  const data: Advocate[] = await db.select().from(advocates);

  return Response.json({ data });
}
