import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { slug } = params;
  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        user: true,
        cat: true,
        subcategory: true,
      },
    });

    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(post), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
