import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test a simple query
    const contactCount = await prisma.contactForm.count()
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      contactFormCount: contactCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Health check failed:", error)
    
    return NextResponse.json({
      status: "unhealthy",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 