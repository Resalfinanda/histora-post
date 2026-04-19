// components/navbar/Navbar.tsx
"use client";

import { useState } from "react";
import { NavMenu } from "./navbarMenu";
import { NavbarActions } from "./navActions";
import { MobileSearchInput } from "./search-bar";
import { NAV_ITEMS } from "@/lib/navData";
import Link from "next/link";

export function Navbar() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-[#1E2A44] border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between md:justify-evenly h-16 px-4">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-lg italic">
            Historapost
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <NavMenu items={NAV_ITEMS} />
          </div>

          {/* Actions + Mobile */}
          <NavbarActions
            isMobileSearchOpen={isMobileSearchOpen}
            onMobileSearchChange={setIsMobileSearchOpen}
          />
        </div>
      </header>

      {/* Mobile Search Input - appears below navbar */}
      <MobileSearchInput
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}
