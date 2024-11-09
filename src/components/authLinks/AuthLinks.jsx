import React from "react";
import Link from "next/link";
import styles from "./authLinks.module.css";

export default function AuthLinks() {
  const status = "notauthenticated";

  return (
    <>
      {status === "notauthenticated" ? (
        <Link href="/login">Login</Link>
      ) : (
        <>
          <Link href="/write" className="text-primary hover:underline mr-4">
            Write
          </Link>
          <button className={styles.link}>Logout</button>
        </>
      )}
    </>
  );
}
