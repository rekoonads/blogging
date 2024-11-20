"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

import styles from "./navbar.module.css";
import SearchBar from "../searchBar/SearchBar";

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
        {Object.entries(menuItems).map(([menu, subcategories]) => (
          <div
            key={menu}
            className={styles.megaMenu}
            onMouseEnter={() => handleMouseEnter(menu)}
            onMouseLeave={handleMouseLeave}
          >
            <Link href={`/category/${menu}`} className={styles.link}>
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </Link>
            {openMenu === menu && subcategories.length > 0 && (
              <div className={styles.megaMenuContent}>
                {subcategories.map((item) => (
                  <Link
                    key={item}
                    href={`/category/${menu}/${item.toLowerCase()}`}
                    className={styles.megaMenuItem}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <SearchBar />
        <ThemeToggle />
        <AuthLinks />
      </div>
    </div>
  );
}
