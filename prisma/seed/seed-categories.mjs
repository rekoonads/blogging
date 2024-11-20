import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Create the gaming category if it doesn't exist
    const gaming = await prisma.category.upsert({
      where: { slug: "gaming" },
      update: {
        title: "Gaming",
        img: "/gaming.png",
        subcategories: {
          upsert: [
            {
              where: { slug: "pc" },
              update: { title: "PC" },
              create: { slug: "pc", title: "PC" },
            },
            {
              where: { slug: "playstation" },
              update: { title: "PlayStation" },
              create: { slug: "playstation", title: "PlayStation" },
            },
            {
              where: { slug: "xbox" },
              update: { title: "Xbox" },
              create: { slug: "xbox", title: "Xbox" },
            },
            {
              where: { slug: "mobile" },
              update: { title: "Mobile" },
              create: { slug: "mobile", title: "Mobile" },
            },
            {
              where: { slug: "esports" },
              update: { title: "Esports" },
              create: { slug: "esports", title: "Esports" },
            },
            {
              where: { slug: "nintendo" },
              update: { title: "Nintendo" },
              create: { slug: "nintendo", title: "Nintendo" },
            },
          ],
        },
      },
      create: {
        slug: "gaming",
        title: "Gaming",
        img: "/gaming.png",
        subcategories: {
          create: [
            { slug: "pc", title: "PC" },
            { slug: "playstation", title: "PlayStation" },
            { slug: "xbox", title: "Xbox" },
            { slug: "mobile", title: "Mobile" },
            { slug: "esports", title: "Esports" },
            { slug: "nintendo", title: "Nintendo" },
          ],
        },
      },
      include: {
        subcategories: true,
      },
    });

    console.log(
      "Gaming category created/updated:",
      JSON.stringify(gaming, null, 2)
    );

    // Create the reviews category if it doesn't exist
    const reviews = await prisma.category.upsert({
      where: { slug: "reviews" },
      update: {
        title: "Reviews",
        img: "/reviews.png",
        subcategories: {
          upsert: [
            {
              where: { slug: "game" },
              update: { title: "Game" },
              create: { slug: "game", title: "Game" },
            },
            {
              where: { slug: "tech" },
              update: { title: "Tech" },
              create: { slug: "tech", title: "Tech" },
            },
            {
              where: { slug: "movie" },
              update: { title: "Movie" },
              create: { slug: "movie", title: "Movie" },
            },
            {
              where: { slug: "comic" },
              update: { title: "Comic" },
              create: { slug: "comic", title: "Comic" },
            },
            {
              where: { slug: "tv" },
              update: { title: "TV" },
              create: { slug: "tv", title: "TV" },
            },
          ],
        },
      },
      create: {
        slug: "reviews",
        title: "Reviews",
        img: "/reviews.png",
        subcategories: {
          create: [
            { slug: "game", title: "Game" },
            { slug: "tech", title: "Tech" },
            { slug: "movie", title: "Movie" },
            { slug: "comic", title: "Comic" },
            { slug: "tv", title: "TV" },
          ],
        },
      },
      include: {
        subcategories: true,
      },
    });

    console.log(
      "Reviews category created/updated:",
      JSON.stringify(reviews, null, 2)
    );

    // Create other categories without subcategories
    const otherCategories = ["tech", "videos", "movies", "tv"];
    for (const categorySlug of otherCategories) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {
          title: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
          img: `/${categorySlug}.png`,
        },
        create: {
          slug: categorySlug,
          title: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
          img: `/${categorySlug}.png`,
        },
      });
      console.log(
        `${category.title} category created/updated:`,
        JSON.stringify(category, null, 2)
      );
    }

    // Verify all categories and subcategories
    const allCategories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });

    console.log("\nAll categories and subcategories:");
    allCategories.forEach((category) => {
      console.log(`Category: ${category.title} (${category.slug})`);
      category.subcategories.forEach((subcategory) => {
        console.log(`  - ${subcategory.title} (${subcategory.slug})`);
      });
    });

    console.log("\nDatabase seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
