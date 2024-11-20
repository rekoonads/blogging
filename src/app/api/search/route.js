// app/api/search/route.js
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
// Adjust this import based on your Prisma client setup

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const results = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { desc: { contains: q, mode: "insensitive" } },
          {
            comments: { some: { desc: { contains: q, mode: "insensitive" } } },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        desc: true,
        slug: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        comments: {
          select: {
            desc: true,
          },
          take: 1,
        },
      },
      take: 10,
    });

    const formattedResults = results.map((result) => ({
      id: result.id,
      title: result.title,
      excerpt: result.desc.substring(0, 150) + "...",
      slug: result.slug,
      createdAt: result.createdAt,
      author: result.user.name,
      authorImage: result.user.image,
      commentCount: result.comments.length,
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 }
    );
  }
}
