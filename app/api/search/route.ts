// File: app/api/search/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    const results = await prisma.exp_india.findMany({
      where: {
        OR: [
          { product_description: { contains: query, mode: "insensitive" } },
          { hs_code: { contains: query, mode: "insensitive" } },
        ],
      },

      take: 10,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
