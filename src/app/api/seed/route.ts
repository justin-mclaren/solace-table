import db from "@/db";
import { advocates, specialties, advocateSpecialties } from "@/db/schema";
import { advocateData, specialtyList } from "@/db/seed/advocates";

export async function POST() {
  try {
    // Clear existing data first (cascade will handle join table)
    await db.delete(advocates);
    await db.delete(specialties);

    // Insert specialties first
    const specialtyRecords = await db
      .insert(specialties)
      .values(specialtyList.map((name) => ({ name })))
      .returning();

    // Create a map of specialty name to ID for quick lookup
    const specialtyMap = new Map<string, number>(
      specialtyRecords.map((s: { name: string; id: number }) => [s.name, s.id])
    );

    // Insert advocates in batches
    const BATCH_SIZE = 100;
    let totalAdvocates = 0;
    let totalSpecialtyLinks = 0;

    for (let i = 0; i < advocateData.length; i += BATCH_SIZE) {
      const batch = advocateData.slice(i, i + BATCH_SIZE);

      // Insert advocates (without specialties field)
      const advocateRecords = await db
        .insert(advocates)
        .values(batch.map(({ specialties: _, ...advocate }) => advocate))
        .returning();

      totalAdvocates += advocateRecords.length;

      // Insert advocate-specialty relationships
      const relationships = [];
      for (let j = 0; j < advocateRecords.length; j++) {
        const advocate = advocateRecords[j];
        const advocateSpecialtyNames = batch[j].specialties;

        for (const specialtyName of advocateSpecialtyNames) {
          const specialtyId = specialtyMap.get(specialtyName);
          if (specialtyId) {
            relationships.push({
              advocateId: advocate.id,
              specialtyId,
            });
          }
        }
      }

      if (relationships.length > 0) {
        await db.insert(advocateSpecialties).values(relationships);
        totalSpecialtyLinks += relationships.length;
      }
    }

    return Response.json({
      success: true,
      advocates: totalAdvocates,
      specialties: specialtyRecords.length,
      relationships: totalSpecialtyLinks,
      message: `Successfully seeded ${totalAdvocates} advocates with ${totalSpecialtyLinks} specialty relationships`,
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
