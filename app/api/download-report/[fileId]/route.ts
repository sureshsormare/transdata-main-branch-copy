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

    // Define the reports directory
    const reportsDir = path.join(process.cwd(), 'reports');
    const filePath = path.join(reportsDir, `${fileId}.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Read the report data
    const reportData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Determine file type and extension
    const format = reportData.format || 'pdf';
    const extension = format === 'pdf' ? 'pdf' : 'pptx';
    const fileName = reportData.fileName || `transdata-report-${fileId}.${extension}`;
    
    // Check if the actual file exists
    const actualFilePath = path.join(reportsDir, `${fileId}.${extension}`);
    
    if (!fs.existsSync(actualFilePath)) {
      return NextResponse.json({ error: 'Generated file not found' }, { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(actualFilePath);
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    
    // Properly encode filename for Content-Disposition header
    const encodedFileName = encodeURIComponent(fileName);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download report' }, { status: 500 });
  }
} 