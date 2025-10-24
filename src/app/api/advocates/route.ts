import db from "@/db";
import { advocates, specialties, advocateSpecialties } from "@/db/schema";
import {
  sql,
  and,
  inArray,
  or,
  gte,
  lte,
  eq,
  ilike,
  asc,
  desc,
} from "drizzle-orm";

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

  // Get sort parameters
  const sortBy = searchParams.get("sortBy") || "lastName";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // Validate sortBy to prevent invalid field access
  const validSortFields = [
    "lastName",
    "firstName",
    "city",
    "degree",
    "yearsOfExperience",
  ] as const;
  const sortField = validSortFields.includes(sortBy as any)
    ? sortBy
    : "lastName";

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
          case "0-5":
            return and(
              gte(advocates.yearsOfExperience, 0),
              lte(advocates.yearsOfExperience, 5)
            );
          case "6-10":
            return and(
              gte(advocates.yearsOfExperience, 6),
              lte(advocates.yearsOfExperience, 10)
            );
          case "11-15":
            return and(
              gte(advocates.yearsOfExperience, 11),
              lte(advocates.yearsOfExperience, 15)
            );
          case "16-20":
            return and(
              gte(advocates.yearsOfExperience, 16),
              lte(advocates.yearsOfExperience, 20)
            );
          case "21+":
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
    // Use subquery to find advocate IDs that match any of the selected specialties
    const matchingAdvocateIds = db
      .select({ id: advocateSpecialties.advocateId })
      .from(advocateSpecialties)
      .innerJoin(
        specialties,
        eq(advocateSpecialties.specialtyId, specialties.id)
      )
      .where(inArray(specialties.name, specialtyNames));

    advocateConditions.push(inArray(advocates.id, matchingAdvocateIds));
  }

  const whereClause =
    advocateConditions.length > 0 ? and(...advocateConditions) : undefined;

  // Fetch filtered advocates with aggregated specialties and computed fields
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
      // Computed fields - calculate once on server
      initials: sql<string>`UPPER(SUBSTRING(${advocates.firstName}, 1, 1) || SUBSTRING(${advocates.lastName}, 1, 1))`,
      formattedPhoneNumber: sql<string>`CONCAT('(', SUBSTRING(${advocates.phoneNumber}::text, 1, 3), ') ', SUBSTRING(${advocates.phoneNumber}::text, 4, 3), '-', SUBSTRING(${advocates.phoneNumber}::text, 7, 4))`,
    })
    .from(advocates)
    .leftJoin(
      advocateSpecialties,
      eq(advocates.id, advocateSpecialties.advocateId)
    )
    .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
    .where(whereClause)
    .groupBy(advocates.id)
    .orderBy(
      sortOrder === "desc"
        ? desc(
            sortField === "lastName"
              ? advocates.lastName
              : sortField === "firstName"
                ? advocates.firstName
                : sortField === "city"
                  ? advocates.city
                  : sortField === "degree"
                    ? advocates.degree
                    : advocates.yearsOfExperience
          )
        : asc(
            sortField === "lastName"
              ? advocates.lastName
              : sortField === "firstName"
                ? advocates.firstName
                : sortField === "city"
                  ? advocates.city
                  : sortField === "degree"
                    ? advocates.degree
                    : advocates.yearsOfExperience
          ),
      // CRITICAL: Secondary sort by ID for deterministic pagination
      // Without this, advocates with same lastName/city/etc. can appear in different order
      // across requests, causing duplicates and missing records across pages
      asc(advocates.id)
    )
    .limit(limit)
    .offset(offset);

  // Only calculate total count on first page (expensive query with joins)
  // Subsequent pages don't need it - client uses count from page 1
  let totalCount: number;

  if (page === 1) {
    const countResult = await db
      .select({ count: sql<number>`count(DISTINCT ${advocates.id})` })
      .from(advocates)
      .leftJoin(
        advocateSpecialties,
        eq(advocates.id, advocateSpecialties.advocateId)
      )
      .leftJoin(
        specialties,
        eq(advocateSpecialties.specialtyId, specialties.id)
      )
      .where(whereClause);

    totalCount = Number(countResult[0].count);
  } else {
    // For page > 1, calculate hasMore based on result length
    // Client already has total from page 1
    totalCount = 0; // Not used by client for pages > 1
  }

  const hasMore =
    page === 1
      ? offset + advocatesResult.length < totalCount
      : advocatesResult.length === limit; // If we got a full page, assume more exist

  return Response.json({
    data: advocatesResult,
    nextPage: hasMore ? page + 1 : undefined,
    hasMore,
    total: totalCount,
  });
}
