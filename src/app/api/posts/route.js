import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const POST_PER_PAGE = 2;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(category && { cat: { slug: category } }),
      ...(subcategory && { subcategory: { slug: subcategory } }),
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

    return NextResponse.json({ posts, count }, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/posts:", err);
    return NextResponse.json(
      { message: "Something went wrong!", error: err.message },
      { status: 500 }
    );
  }
}

// ... rest of the code remains the same

export async function POST(req) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Not Authenticated!" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { title, desc, img, slug, catSlug, subcategorySlug } = body;

    console.log("Received POST request with body:", body);

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { slug: catSlug },
      include: { subcategories: true },
    });

    if (!category) {
      console.error(`Category not found: ${catSlug}`);
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    console.log("Found category:", JSON.stringify(category, null, 2));

    // If subcategorySlug is provided, check if it exists
    let subcategory;
    if (subcategorySlug) {
      subcategory = category.subcategories.find(
        (sub) => sub.slug === subcategorySlug.toLowerCase()
      );

      if (!subcategory) {
        console.error(`Subcategory not found: ${subcategorySlug}`);
        console.error(
          `Available subcategories for ${catSlug}:`,
          category.subcategories
        );
        return NextResponse.json(
          {
            message: "Subcategory not found",
            availableSubcategories: category.subcategories.map(
              (sub) => sub.slug
            ),
          },
          { status: 404 }
        );
      }
    }

    console.log("Found subcategory:", subcategory);

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        desc,
        img,
        slug,
        cat: { connect: { id: category.id } },
        subcategory: subcategory
          ? { connect: { id: subcategory.id } }
          : undefined,
        user: { connect: { email: session.user.email } },
      },
      include: {
        cat: true,
        subcategory: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    console.log("Created post:", post);

    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/posts:", err);
    return NextResponse.json(
      { message: "Something went wrong!", error: err.message },
      { status: 500 }
    );
  }
}
