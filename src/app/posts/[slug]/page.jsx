import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import RelativeDate from "@/components/RelativeDate";
import { formatDate } from "@/utils/utils";
import Link from "next/link";

const getData = async (slug) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
};

export default async function SinglePage({ params }) {
  const { slug } = params;

  const data = await getData(slug);

  // Check if data is valid
  if (!data || typeof data !== "object") {
    return <div>Error: Invalid data received from the server.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data.title || "Untitled"}</h1>
          <div className={styles.categoryInfo}>
            {data.cat ? (
              <Link
                href={`/${data.cat.slug || ""}`}
                className={styles.category}
              >
                {data.cat.title || "Uncategorized"}
              </Link>
            ) : (
              <span className={styles.category}>Uncategorized</span>
            )}
            {data.subcategory && (
              <>
                <span className={styles.separator}>{">"}</span>
                <Link
                  href={`/${data.cat?.slug || ""}/${
                    data.subcategory.slug || ""
                  }`}
                  className={styles.subcategory}
                >
                  {data.subcategory.title || "Uncategorized"}
                </Link>
              </>
            )}
          </div>
          <div className={styles.user}>
            {data.user?.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={data.user.image}
                  alt={`${data.user.name || "User"}'s avatar`}
                  fill
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>
                {data.user?.name || "Anonymous"}
              </span>
              <span className={styles.date}>
                {formatDate(data.createdAt || new Date())}
                {" • "}
                <RelativeDate dateString={data.createdAt || new Date()} />
              </span>
            </div>
          </div>
        </div>
        {data.img && (
          <div className={styles.imageContainer}>
            <Image
              src={data.img}
              alt={data.title || "Post image"}
              fill
              className={styles.image}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data.desc || "" }}
          />
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
}
