import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
            memberCategory: true
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return NextResponse.json({ error: "Failed to fetch community posts." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorId, content, category } = await req.json();

    if (!authorId || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: {
        authorId,
        content,
        category: category || "General"
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            memberCategory: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
