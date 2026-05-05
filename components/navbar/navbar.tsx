"use client";

import { useState } from "react";
import { NavMenu } from "./navbarMenu";
import { NavbarActions } from "./navActions";
import { MobileSearchInput, SearchBar } from "./search-bar";
import { NAV_ITEMS } from "@/lib/navData";
import Link from "next/link";

export function Navbar() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const date = new Date();
  const currentDay = date.toLocaleDateString("id-ID", { weekday: "long" });
  const currentDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* 1. Bagian Atas: Logo, Search, dll (Biasa, akan ikut ter-scroll) */}
      <header className="w-full bg-[#0f172a] text-white relative z-40">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-20 px-4 gap-4">
          
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl tracking-wider uppercase">
            HISTORAPOST
          </Link>

          {/* Tengah: Search Bar Desktop */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl mx-4">
            <SearchBar isMobile={false} />
          </div>

          {/* Kanan: Actions & Tanggal */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <SearchBar
                isMobile={true}
                isOpen={isMobileSearchOpen}
                onOpenChange={setIsMobileSearchOpen}
              />
            </div>

            <NavbarActions />

            {/* Tampilan Tanggal */}
            <div 
              suppressHydrationWarning 
              className="hidden lg:flex flex-col items-end text-sm border-l border-white/20 pl-4"
            >
              <span suppressHydrationWarning className="font-medium">{currentDay}</span>
              <span suppressHydrationWarning className="text-gray-300 text-xs">{currentDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Bagian Bawah: Menu Navigasi (Sticky Top) */}
      {/* Menggunakan sticky, top-0, dan z-50 di sini agar menempel di atas layar */}
      <div className="sticky top-0 z-50 w-full bg-[#0f172a] text-white shadow-md">
        <NavMenu items={NAV_ITEMS} />
      </div>

      {/* Input Pencarian Khusus Mobile */}
      <MobileSearchInput
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}