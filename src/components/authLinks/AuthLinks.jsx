"use client";

import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function AuthLinks() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const menuItems = {
    reviews: ["Game", "Tech", "Movie", "Comic", "TV"],
    gaming: ["PC", "PlayStation", "Xbox", "Mobile", "Esports", "Nintendo"],
    tech: [],
    videos: [],
    movies: [],
    tv: [],
  };

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          {session?.user?.isAllowedToWrite && (
            <Link href="/write" className={styles.link}>
              Write
            </Link>
          )}
          <span className={styles.link} onClick={() => signOut()}>
            Logout
          </span>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/" onClick={() => setOpen(false)}>
            Homepage
          </Link>
          {Object.entries(menuItems).map(([menu, subcategories]) => (
            <div key={menu} className={styles.mobileMenuItem}>
              <Link href={`/category/${menu}`} onClick={() => setOpen(false)}>
                {menu.charAt(0).toUpperCase() + menu.slice(1)}
              </Link>
              {subcategories.length > 0 && (
                <div className={styles.mobileSubMenu}>
                  {subcategories.map((item) => (
                    <Link
                      key={item}
                      href={`/category/${menu}/${item.toLowerCase()}`}
                      onClick={() => setOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {status === "unauthenticated" ? (
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              {session?.user?.isAllowedToWrite && (
                <Link href="/write" onClick={() => setOpen(false)}>
                  Write
                </Link>
              )}
              <span
                className={styles.link}
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
}
