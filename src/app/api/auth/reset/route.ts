import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import crypto from "crypto";
// Need bcrypt, let's assume it's installed since it's NextAuth std. If not, we will just simulate for now, or use bcrypt.
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    // 1. Hash the incoming raw token to match the DB signature
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find the user with this token where expiry > now
    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired recovery token." }, { status: 400 });
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the user record and clear the tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password has been successfully updated." }, { status: 200 });
  } catch (error: any) {
    console.error("[Reset API Error]", error);
    return NextResponse.json({ error: "Failed to process password reset." }, { status: 500 });
  }
}
