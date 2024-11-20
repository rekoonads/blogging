import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const cat = searchParams.get("cat");
  const subcategorySlug = searchParams.get("subcategory");

  const POST_PER_PAGE = 2;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
      ...(subcategorySlug && { subcategory: { slug: subcategorySlug } }),
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
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), {
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const { title, desc, img, slug, catSlug, subcategorySlug } = body;

    // First, find the subcategory ID based on the slug
    let subcategoryId = null;
    if (subcategorySlug) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { slug: subcategorySlug },
        select: { id: true },
      });
      if (subcategory) {
        subcategoryId = subcategory.id;
      }
    }

    // Now create the post with the subcategoryId
    const post = await prisma.post.create({
      data: {
        title,
        desc,
        img,
        slug,
        catSlug,
        subcategoryId,
        userEmail: session.user.email,
      },
    });

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!", error: err.message }),
      { status: 500 }
    );
  }
};
