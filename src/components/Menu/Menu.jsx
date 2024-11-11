import React from "react";
import styles from "./menu.module.css";
import Link from "next/link";
import Image from "next/image";
import MenuPosts from "../menuPosts/MenuPosts";

const Menu = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>What&apos;s hot</h2>
      <h1 className={styles.title}>Most Popular</h1>

      <h2 className={styles.subtitle}>Discover by topic</h2>
      <h1 className={styles.title}>Categories</h1>
      <div className={styles.categoryList}>
        <Link
          href={"/blog?cat=style"}
          className={`${styles.categoryItem} ${styles.style}`}
        >
          Styles
        </Link>
        <Link href={`/blog`} className={`${styles.category} ${styles.fashion}`}>
          fashion
        </Link>
        <Link href={`/blog`} className={`${styles.category} ${styles.food}`}>
          food
        </Link>
        <Link href={`/blog`} className={`${styles.category} ${styles.travel}`}>
          Travel
        </Link>
        <Link href={`/blog`} className={`${styles.category} ${styles.culture}`}>
          Culture
        </Link>
        <Link href={`/blog`} className={`${styles.category} ${styles.coding}`}>
          coding
        </Link>
      </div>
      <h2 className={styles.subtitle}>Chosen by the editor</h2>
      <h1 className={styles.title}>Editors Pick</h1>
      <MenuPosts withImage={true} />
    </div>
  );
};

export default Menu;
