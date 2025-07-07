import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface EmailRequest {
  email: string;
  fileId: string;
  fileName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { email, fileId, fileName } = body;

    if (!email || !fileId || !fileName) {
      return NextResponse.json({
        success: false,
        error: 'Email, fileId, and fileName are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Check if report metadata exists
    const tempDir = path.join(process.cwd(), 'tmp');
    const metadataPath = path.join(tempDir, `${fileId}.json`);

    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json({
        success: false,
        error: 'Report not found or expired'
      }, { status: 404 });
    }

    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    // Check if report has expired
    if (new Date(metadata.expiresAt) < new Date()) {
      fs.unlinkSync(metadataPath);
      return NextResponse.json({
        success: false,
        error: 'Report has expired'
      }, { status: 410 });
    }

    // In a real implementation, you would:
    // 1. Generate the file (PDF/PPT)
    // 2. Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 3. Send email with download link using a service like SendGrid, AWS SES, etc.
    // 4. Track email delivery status

    // For now, we'll simulate the email sending process
    console.log(`Email delivery requested for ${fileName} to ${email}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Report will be delivered to your email shortly',
      email,
      fileName,
      estimatedDelivery: '5-10 minutes'
    });

  } catch (error) {
    console.error('Email delivery error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process email delivery request'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email Report Delivery API',
    endpoints: {
      POST: 'Send report via email'
    }
  });
} 