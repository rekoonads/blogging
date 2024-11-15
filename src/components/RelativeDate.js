"use client";

import { useEffect, useState } from "react";

export default function RelativeDate({ dateString }) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date();
      const past = new Date(dateString);
      const diffTime = Math.abs(now - past);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        setRelativeTime("Today");
      } else if (diffDays === 1) {
        setRelativeTime("Yesterday");
      } else if (diffDays < 7) {
        setRelativeTime(`${diffDays} days ago`);
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        setRelativeTime(`${weeks} ${weeks === 1 ? "week" : "weeks"} ago`);
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        setRelativeTime(`${months} ${months === 1 ? "month" : "months"} ago`);
      } else {
        const years = Math.floor(diffDays / 365);
        setRelativeTime(`${years} ${years === 1 ? "year" : "years"} ago`);
      }
    };

    updateRelativeTime();
    const timer = setInterval(updateRelativeTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [dateString]);

  return <span>{relativeTime}</span>;
}
