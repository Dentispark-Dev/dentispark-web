import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET() {
    try {
        const count = await prisma.user.count();
        return NextResponse.json({ status: "ok", userCount: count });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
