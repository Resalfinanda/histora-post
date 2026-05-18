import { MainContent } from "@/components/home";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense
        fallback={<div className="text-center py-12">Memuat konten...</div>}
      >
        <MainContent />
      </Suspense>
    </main>
  );
}
