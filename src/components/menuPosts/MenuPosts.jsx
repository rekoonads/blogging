import Image from "next/image";
import Link from "next/link";
import styles from "./menuPosts.module.css";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/menu`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

const MenuPosts = async ({ withImage }) => {
  const posts = await getPosts();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.items}>
      {posts.map((post) => (
        <Link
          href={`/posts/${post.slug}`}
          className={styles.item}
          key={post.id}
        >
          {withImage && post.img && (
            <div className={styles.imageContainer}>
              <Image
                src={post.img}
                alt={post.title}
                fill
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[post.cat.slug]}`}>
              {post.cat.slug}
            </span>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.detail}>
              <span className={styles.username}>{post.user.name}</span>
              <span className={styles.date}>
                {" "}
                - {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
