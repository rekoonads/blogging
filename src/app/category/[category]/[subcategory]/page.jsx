import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./subcategoryPage.module.css";

async function getSubcategoryPosts(category, subcategory) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/category/${category}/${subcategory}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return notFound();
  }

  return res.json();
}

export default async function SubcategoryPage({ params }) {
  const posts = await getSubcategoryPosts(params.category, params.subcategory);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {params.category.charAt(0).toUpperCase() + params.category.slice(1)} -{" "}
        {params.subcategory.charAt(0).toUpperCase() +
          params.subcategory.slice(1)}{" "}
        Posts
      </h1>
      <div className={styles.posts}>
        {posts.map((post) => (
          <Link
            href={`/posts/${post.slug}`}
            key={post.id}
            className={styles.post}
          >
            {post.img && (
              <div className={styles.imageContainer}>
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.content}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postDesc}>
                {post.desc.substring(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
