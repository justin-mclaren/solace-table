import db from "@/db";
import { advocates } from "@/db/schema";
import { Advocate } from "@/types/advocate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const offset = (page - 1) * limit;

  const data: Advocate[] = await db
    .select()
    .from(advocates)
    .limit(limit)
    .offset(offset);

  // Get total count for hasMore calculation
  const total = await db.select().from(advocates);
  const hasMore = offset + data.length < total.length;

  return Response.json({
    data,
    nextPage: hasMore ? page + 1 : undefined,
    hasMore,
  });
}
