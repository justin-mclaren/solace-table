import db from "@/db";
import { advocates, specialties, advocateSpecialties } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get unique cities
    const citiesResult = await db
      .selectDistinct({ city: advocates.city })
      .from(advocates)
      .orderBy(advocates.city);

    // Get unique degrees
    const degreesResult = await db
      .selectDistinct({ degree: advocates.degree })
      .from(advocates)
      .orderBy(advocates.degree);

    // Get all specialties (already unique due to table design)
    const specialtiesResult = await db
      .select({ name: specialties.name })
      .from(specialties)
      .orderBy(specialties.name);

    return Response.json({
      cities: citiesResult.map((r: { city: string }) => r.city),
      degrees: degreesResult.map((r: { degree: string }) => r.degree),
      specialties: specialtiesResult.map((r: { name: string }) => r.name),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
