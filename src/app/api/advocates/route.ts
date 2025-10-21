import db from "@/db";
import { advocates, specialties, advocateSpecialties } from "@/db/schema";
import { sql, and, inArray, or, gte, lte, eq, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // Get filter parameters
  const search = searchParams.get("search") || "";
  const cities = searchParams.get("cities")?.split(",").filter(Boolean) || [];
  const degrees = searchParams.get("degrees")?.split(",").filter(Boolean) || [];
  const specialtyNames =
    searchParams.get("specialties")?.split(",").filter(Boolean) || [];
  const experienceRanges =
    searchParams.get("experienceRanges")?.split(",").filter(Boolean) || [];

  const offset = (page - 1) * limit;

  // Build base WHERE conditions for advocates table
  const advocateConditions = [];

  // Search across name, city, and specialties
  if (search) {
    const searchPattern = `%${search}%`;
    advocateConditions.push(
      or(
        ilike(advocates.firstName, searchPattern),
        ilike(advocates.lastName, searchPattern),
        ilike(advocates.city, searchPattern),
        // Search in specialties via subquery
        sql`EXISTS (
          SELECT 1 FROM ${advocateSpecialties}
          INNER JOIN ${specialties} ON ${advocateSpecialties.specialtyId} = ${specialties.id}
          WHERE ${advocateSpecialties.advocateId} = ${advocates.id}
          AND ${specialties.name} ILIKE ${searchPattern}
        )`
      )
    );
  }

  if (cities.length > 0) {
    advocateConditions.push(inArray(advocates.city, cities));
  }

  if (degrees.length > 0) {
    advocateConditions.push(inArray(advocates.degree, degrees));
  }

  // For experience ranges
  if (experienceRanges.length > 0) {
    const experienceConditions = experienceRanges
      .map((range) => {
        switch (range) {
          case "0-5 years":
            return and(
              gte(advocates.yearsOfExperience, 0),
              lte(advocates.yearsOfExperience, 5)
            );
          case "6-10 years":
            return and(
              gte(advocates.yearsOfExperience, 6),
              lte(advocates.yearsOfExperience, 10)
            );
          case "11-15 years":
            return and(
              gte(advocates.yearsOfExperience, 11),
              lte(advocates.yearsOfExperience, 15)
            );
          case "16-20 years":
            return and(
              gte(advocates.yearsOfExperience, 16),
              lte(advocates.yearsOfExperience, 20)
            );
          case "21+ years":
            return gte(advocates.yearsOfExperience, 21);
          default:
            return null;
        }
      })
      .filter(
        (condition): condition is NonNullable<typeof condition> =>
          condition !== null
      );

    if (experienceConditions.length > 0) {
      advocateConditions.push(or(...experienceConditions));
    }
  }

  // For specialty filtering, we need to filter advocates that have ANY of the selected specialties
  if (specialtyNames.length > 0) {
    const escapedNames = specialtyNames
      .map((n) => `'${n.replace(/'/g, "''")}'`)
      .join(",");
    const specialtyCondition = sql`EXISTS (
      SELECT 1 FROM ${advocateSpecialties}
      JOIN ${specialties} ON ${advocateSpecialties.specialtyId} = ${specialties.id}
      WHERE ${advocateSpecialties.advocateId} = ${advocates.id}
      AND ${specialties.name} IN (${sql.raw(escapedNames)})
    )`;
    advocateConditions.push(specialtyCondition);
  }

  const whereClause =
    advocateConditions.length > 0 ? and(...advocateConditions) : undefined;

  // Fetch filtered advocates with aggregated specialties
  const advocatesResult = await db
    .select({
      id: advocates.id,
      firstName: advocates.firstName,
      lastName: advocates.lastName,
      city: advocates.city,
      degree: advocates.degree,
      yearsOfExperience: advocates.yearsOfExperience,
      phoneNumber: advocates.phoneNumber,
      createdAt: advocates.createdAt,
      specialties: sql<string[]>`COALESCE(
        ARRAY_AGG(${specialties.name} ORDER BY ${specialties.name}) FILTER (WHERE ${specialties.name} IS NOT NULL),
        ARRAY[]::text[]
      )`,
    })
    .from(advocates)
    .leftJoin(
      advocateSpecialties,
      eq(advocates.id, advocateSpecialties.advocateId)
    )
    .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
    .where(whereClause)
    .groupBy(advocates.id)
    .limit(limit)
    .offset(offset);

  // Get total count with filters applied
  const countResult = await db
    .select({ count: sql<number>`count(DISTINCT ${advocates.id})` })
    .from(advocates)
    .leftJoin(
      advocateSpecialties,
      eq(advocates.id, advocateSpecialties.advocateId)
    )
    .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
    .where(whereClause);

  const totalCount = Number(countResult[0].count);
  const hasMore = offset + advocatesResult.length < totalCount;

  return Response.json({
    data: advocatesResult,
    nextPage: hasMore ? page + 1 : undefined,
    hasMore,
    total: totalCount,
  });
}
