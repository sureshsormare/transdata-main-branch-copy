import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().optional(),
  contact: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate request body
    const validatedData = contactFormSchema.parse(body)
    const { name, email, organization, contact, message } = validatedData

    console.log("Attempting to save contact form data:", { name, email, organization, contact, message })

    // Save to database
    await prisma.contactForm.create({
      data: { name, email, organization, contact, message },
    })

    console.log("Contact form data saved successfully")

    // Send email notification (optional - only if email config is available)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtpout.secureserver.net",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

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
        })
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        // Continue execution even if email fails
      }
    } else {
      console.log("Email configuration not available - skipping email notification")
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    console.error("Contact API Error:", error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data. Please check your inputs." },
        { status: 400 }
      )
    }
    
    // Handle database connection errors
    if (error instanceof Error && error.message.includes("connect")) {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      )
    }
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes("prisma")) {
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    )
  }
}
