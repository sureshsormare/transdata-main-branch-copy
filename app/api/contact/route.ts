import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, organization, contact, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    await prisma.contactForm.create({
      data: { name, email, organization, contact, message },
    });

    // Send email to your team
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TransData Site Contact" <${process.env.EMAIL_USER}>`,
      to: "komal@transdatanexus.com",
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="max-width:480px;margin:24px auto;padding:24px;background:#f8fafc;border-radius:16px;box-shadow:0 4px 24px rgba(30,64,175,0.08);font-family:Segoe UI,Arial,sans-serif;">
          <div style="text-align:center;margin-bottom:24px;">
            <h2 style="color:#1b6cae;margin:0 0 8px 0;">New Contact Form Submission</h2>
            <div style="height:3px;width:60px;background:#1b6cae;margin:0 auto 12px auto;border-radius:2px;"></div>
          </div>
          <table style="width:100%;font-size:16px;color:#222;">
            <tr>
              <td style="padding:8px 0;font-weight:600;width:140px;">Name:</td>
              <td style="padding:8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;">Email:</td>
              <td style="padding:8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;">Organization:</td>
              <td style="padding:8px 0;">${organization || "-"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;">Contact:</td>
              <td style="padding:8px 0;">${contact || "-"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;vertical-align:top;">Message:</td>
              <td style="padding:8px 0;white-space:pre-line;">${
                message || "-"
              }</td>
            </tr>
          </table>
          <div style="margin-top:32px;text-align:center;color:#888;font-size:13px;">
            <span>TransDataNexus Website Contact</span>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
