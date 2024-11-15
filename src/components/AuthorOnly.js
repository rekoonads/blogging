"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthorOnly({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session || !session.user.isAllowedToWrite) {
      router.push("/"); // Redirect to homepage or an unauthorized page
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user.isAllowedToWrite) {
    return null; // Or you could render an "Unauthorized" message
  }

  return <>{children}</>;
}