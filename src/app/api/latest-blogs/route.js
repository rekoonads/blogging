import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        cat: true,
        subcategory: true,
      },
    });

    return new NextResponse(JSON.stringify(latestPosts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error fetching latest posts" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
