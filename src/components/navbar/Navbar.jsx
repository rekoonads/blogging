"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import styles from "./navbar.module.css";

const Navbar = () => {
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const toggleReviews = () => {
    setIsReviewsOpen(!isReviewsOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link href={"/"}>Peen</Link>
      </div>
      <div className={styles.links}>
        <div
          className={styles.megaMenu}
          onMouseEnter={() => setIsReviewsOpen(true)}
          onMouseLeave={() => setIsReviewsOpen(false)}
        >
          <span className={styles.link}>Reviews</span>
          {isReviewsOpen && (
            <div className={styles.megaMenuContent}>
              <Link href="/reviews/game" className={styles.megaMenuItem}>
                Game Reviews
              </Link>
              <Link href="/reviews/tech" className={styles.megaMenuItem}>
                Tech Reviews
              </Link>
              <Link href="/reviews/movie" className={styles.megaMenuItem}>
                Movie Reviews
              </Link>
              <Link href="/reviews/comic" className={styles.megaMenuItem}>
                Comic Reviews
              </Link>
              <Link href="/reviews/tv" className={styles.megaMenuItem}>
                TV Series Reviews
              </Link>
            </div>
          )}
        </div>
        <ThemeToggle />
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
