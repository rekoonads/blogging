import { Suspense } from "react";
import SearchResults from "./SearchResults";
import Loading from "./loading";

export default function SearchPage({ searchParams }) {
  const query = searchParams.q;

  return (
    <div>
      <h1>Search Results for &apos;{query}&apos;</h1>
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
