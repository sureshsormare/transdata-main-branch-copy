// app/api/search/quick-search/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  
  // Marketing website: Always show only 10 records for showcase
  const page = 1;
  const limit = 10;
  const offset = 0;

  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    // Quick search with minimal data
    const results = await prisma.exp_india.findMany({
      where: {
        OR: [
          { product_description: { contains: query, mode: "insensitive" } },
          { hs_code: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        product_description: true,
        supplier_name: true,
        buyer_name: true,
        country_of_origin: true,
        country_of_destination: true,
        total_value_usd: true,
        shipping_bill_date: true,
        year: true,
        month: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        year: 'desc',
      },
    });

    // Marketing website: Show limited data for showcase
    const totalCount = await prisma.exp_india.count({
      where: {
        OR: [
          { product_description: { contains: query, mode: "insensitive" } },
          { hs_code: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({
      results,
      pagination: {
        page: 1,
        limit: 10,
        total: totalCount,
        hasMore: false, // No pagination for marketing site
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Quick search error:', error);
    return NextResponse.json(
      { error: "Failed to perform quick search" },
      { status: 500 }
    );
  }
} 