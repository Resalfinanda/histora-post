import { Suspense } from "react";
import { SearchPageContent } from "./searchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-foreground/60 text-lg">Memuat hasil pencarian...</p>
      </div>
    </div>
  );
}