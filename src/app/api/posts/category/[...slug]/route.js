import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const slugs = params.slug;
  const category = slugs[0];
  const subcategory = slugs[1];

  try {
    let posts;
    if (subcategory) {
      posts = await prisma.post.findMany({
        where: {
          cat: { slug: category },
          subcategory: { slug: subcategory },
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await prisma.post.findMany({
        where: {
          cat: { slug: category },
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
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(posts, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts", details: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
