import { MainContent } from "@/components/home/main-content";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      {/* Bungkus MainContent dengan Suspense */}
      <Suspense
        fallback={<div className="text-center py-12">Memuat konten...</div>}
      >
        <MainContent />
      </Suspense>
    </main>
  );
}
