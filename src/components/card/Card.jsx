import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

const Card = ({ item }) => {
  const sanitizedDesc = DOMPurify.sanitize(item.desc);

  return (
    <div className={styles.container}>
      {item.img && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()} -{" "}
          </span>
          <span className={styles.category}>{item.cat.title}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1 className={styles.title}>{item.title}</h1>
        </Link>
        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
        />
        <Link href={`/posts/${item.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;
