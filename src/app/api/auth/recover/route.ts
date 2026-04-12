import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { emailService } from "@/src/lib/email-service";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Security best practice: Don't reveal if an email exists or not
      return NextResponse.json({ message: "If this email is registered, a recovery link has been sent." }, { status: 200 });
    }

    // 2. Generate a secure crypto token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. Save the hash to the DB
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 4. Construct the reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

    // 5. Build and Send the Email Template using our native Resend service
    const htmlTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #10b981; font-weight: 800;">DentiSpark Password Recovery</h2>
        <p>Hey ${user.name || 'there'},</p>
        <p>We received a request to reset the password for your DentiSpark account. If you didn't request this, you can safely ignore this email.</p>
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">This link will expire in 1 hour.</p>
      </div>
    `;

    await emailService.send({
      to: email,
      subject: "DentiSpark Password Recovery",
      html: htmlTemplate,
    });

    return NextResponse.json({ message: "If this email is registered, a recovery link has been sent." }, { status: 200 });
  } catch (error: any) {
    console.error("[Recover API Error]", error);
    return NextResponse.json({ error: "Failed to process recovery request." }, { status: 500 });
  }
}
