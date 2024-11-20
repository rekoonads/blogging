"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./searchResults.module.css";

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setIsLoading(false);
        });
    }
  }, [query]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.resultsContainer}>
      {results.length === 0 ? (
        <p className={styles.noResults}>No results found.</p>
      ) : (
        results.map((result) => (
          <div key={result.id} className={styles.resultItem}>
            <Link href={`/posts/${result.slug}`}>
              <h2 className={styles.resultTitle}>{result.title}</h2>
            </Link>
            <p className={styles.resultExcerpt}>{result.excerpt}</p>
            <div className={styles.resultMeta}>
              <div className={styles.authorInfo}>
                {result.authorImage && (
                  <Image
                    src={result.authorImage}
                    alt={result.author}
                    width={24}
                    height={24}
                    className={styles.authorImage}
                  />
                )}
                <span className={styles.authorName}>{result.author}</span>
              </div>
              <span className={styles.resultDate}>
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
              <span className={styles.commentCount}>
                {result.commentCount} comment
                {result.commentCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
