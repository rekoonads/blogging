import Link from "next/link";
import styles from "./menuCategories.module.css";

const MenuCategories = () => {
  const categories = [
    { slug: "gaming", title: "Gaming" },
    { slug: "reviews", title: "Reviews" },
    { slug: "tech", title: "Tech" },
    { slug: "videos", title: "Videos" },
    { slug: "movies", title: "Movies" },
    { slug: "tv", title: "TV" },
  ];

  return (
    <div className={styles.categoryList}>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/blog?cat=${category.slug}`}
          className={`${styles.categoryItem} ${styles[category.slug]}`}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default MenuCategories;
