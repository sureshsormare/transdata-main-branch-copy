import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    
    // Security check: prevent directory traversal
    if (fileId.includes('..') || fileId.includes('/') || fileId.includes('\\')) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    const reportsDir = path.join(process.cwd(), 'reports');
    const metadataPath = path.join(reportsDir, `${fileId}.json`);

    // Check if metadata exists
    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json({ error: 'Report not found or expired' }, { status: 404 });
    }

    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    // Check if report has expired (24 hours)
    if (new Date(metadata.expiresAt) < new Date()) {
      // Clean up expired metadata
      fs.unlinkSync(metadataPath);
      return NextResponse.json({ error: 'Report has expired' }, { status: 410 });
    }

    // Return the report data for viewing in browser
    return NextResponse.json({
      success: true,
      report: metadata.report,
      metadata: {
        searchTerm: metadata.searchTerm,
        format: metadata.format,
        fileName: metadata.fileName,
        createdAt: metadata.createdAt,
        expiresAt: metadata.expiresAt
      }
    });

  } catch (error) {
    console.error('View report error:', error);
    return NextResponse.json(
      { error: 'Failed to load report' },
      { status: 500 }
    );
  }
} 