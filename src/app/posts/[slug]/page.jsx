import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";

import RelativeDate from "@/components/RelativeDate";
import { formatDate } from "@/utils/utils";

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

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            {data?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={data.user.image}
                  alt={`${data.user.name}'s avatar`}
                  fill
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.user.name}</span>
              <span className={styles.date}>
                {formatDate(data?.createdAt)}
                {" • "}
                <RelativeDate dateString={data?.createdAt} />
              </span>
            </div>
          </div>
        </div>
        {data?.img && (
          <div className={styles.imageContainer}>
            <Image
              src={data.img}
              alt={data.title}
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
            dangerouslySetInnerHTML={{ __html: data?.desc }}
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
