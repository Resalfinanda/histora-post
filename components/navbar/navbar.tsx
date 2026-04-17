// components/navbar/Navbar.tsx
import { NavMenu } from "./navbarMenu"
import { NavbarActions } from "./navActions"
import { NAV_ITEMS } from "@/lib/navData"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="w-full bg-[#1E2A44] border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        
        {/* Logo */}
        <Link href="/" className="text-yellow-400 font-bold text-lg italic">
          Historapost
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <NavMenu items={NAV_ITEMS} />
        </div>

        {/* Actions + Mobile */}
        <NavbarActions />

      </div>
    </header>
  )
}