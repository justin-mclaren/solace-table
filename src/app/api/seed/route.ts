import db from "@/db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { Advocate } from "@/types/advocate";

export async function POST() {
  try {
    // Clear existing data first
    await db.delete(advocates);

    // Insert in batches of 100 for better performance
    const BATCH_SIZE = 100;
    const records: Advocate[] = [];

    for (let i = 0; i < advocateData.length; i += BATCH_SIZE) {
      const batch = advocateData.slice(i, i + BATCH_SIZE);
      const batchRecords = await db.insert(advocates).values(batch).returning();
      records.push(...batchRecords);
    }

    return Response.json({
      success: true,
      count: records.length,
      message: `Successfully seeded ${records.length} advocates`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
