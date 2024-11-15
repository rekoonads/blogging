import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
// Adjust this import based on your project structure

export async function GET() {
  try {
    const latestBlogs = await prisma.post.findMany({
      take: 5, // Fetch 5 latest blogs
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        desc: true,
        img: true,
        slug: true,
      },
    });

    return NextResponse.json(latestBlogs);
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return NextResponse.json(
      { error: "Error fetching latest blogs" },
      { status: 500 }
    );
  }
}
