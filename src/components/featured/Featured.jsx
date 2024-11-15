"use client";

import React, { useState, useEffect } from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Featured() {
  const [blogs, setBlogs] = useState([]);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/latest-blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBlogIndex((prevIndex) => (prevIndex + 1) % blogs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [blogs]);

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (blogs.length === 0) {
    return <div className={styles.container}>Loading...</div>;
  }

  const currentBlog = blogs[currentBlogIndex];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, lama dev here!</b> Discover my stories and creative ideas.
      </h1>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBlogIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={styles.post}
        >
          <div className={styles.imgContainer}>
            <Image
              src={currentBlog.img || "/p1.jpeg"}
              alt=""
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.postTitle}>{currentBlog.title}</h2>
            <p className={styles.postDesc}>{stripHtmlTags(currentBlog.desc)}</p>
            <Link href={`/posts/${currentBlog.slug}`}>
              <button
                className={styles.button}
                aria-label={`Read more about ${currentBlog.title}`}
              >
                Read More
              </button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
