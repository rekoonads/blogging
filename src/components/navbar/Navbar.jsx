"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Edit, LogOut } from "lucide-react";
import ThemeToggle from "../themeToggle/ThemeToggle";
import SearchBar from "../searchBar/SearchBar";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Peen
        </Link>
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger}></span>
        </button>
        <div
          className={`${styles.menuContainer} ${
            isMobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <ul className={styles.menu}>
            {Object.entries(menuItems).map(([menu, subcategories]) => (
              <li
                key={menu}
                className={styles.menuItem}
                onMouseEnter={() => handleMouseEnter(menu)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={`/category/${menu}`} className={styles.menuLink}>
                  {menu.charAt(0).toUpperCase() + menu.slice(1)}
                </Link>
                {openMenu === menu && subcategories.length > 0 && (
                  <ul className={styles.submenu}>
                    {subcategories.map((item) => (
                      <li key={item} className={styles.submenuItem}>
                        <Link
                          href={`/category/${menu}/${item.toLowerCase()}`}
                          className={styles.submenuLink}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className={styles.navActions}>
            <SearchBar />
            <ThemeToggle />
            {status === "authenticated" && (
              <>
                {session?.user?.isAllowedToWrite && (
                  <Link href="/write" className={styles.iconLink} title="Write">
                    <Edit size={20} />
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className={styles.iconLink}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
            {status === "unauthenticated" && (
              <Link href="/login" className={styles.loginLink}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
