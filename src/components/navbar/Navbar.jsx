"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = {
    reviews: ["Game", "Tech", "Movie", "Comic", "TV"],
    gaming: ["PC", "PlayStation", "Xbox", "Mobile", "Esports", "Nintendo"],
    tech: [],
    videos: [],
    movies: [],
    tv: [],
  };

  const handleMouseEnter = (menu) => {
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link href={"/"}>Peen</Link>
      </div>
      <div className={styles.links}>
        {Object.keys(menuItems).map((menu) => (
          <div
            key={menu}
            className={styles.megaMenu}
            onMouseEnter={() => handleMouseEnter(menu)}
            onMouseLeave={handleMouseLeave}
          >
            <span className={styles.link}>
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </span>
            {openMenu === menu && menuItems[menu].length > 0 && (
              <div className={styles.megaMenuContent}>
                {menuItems[menu].map((item) => (
                  <Link
                    key={item}
                    href={`/${menu}/${item.toLowerCase()}`}
                    className={styles.megaMenuItem}
                  >
                    {item}{" "}
                    {menu.slice(0, -1).charAt(0).toUpperCase() +
                      menu.slice(0, -1).slice(1)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <ThemeToggle />
        <AuthLinks />
      </div>
    </div>
  );
}
