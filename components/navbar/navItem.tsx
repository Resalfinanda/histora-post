"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface NavItemProps {
  label: string;
  href: string;
}

export function NavItem({ label, href }: NavItemProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // Logika penentu status aktif
  const isActive = currentCategory
    ? href.includes(`category=${currentCategory}`)
    : href === "/"; // 'Semua' aktif jika tidak ada parameter category di URL

  return (
    <Link 
      href={href} 
      className={`text-sm font-medium transition-all duration-300 ${
        isActive 
          ? "text-blue-400 border-b-2 border-blue-400 pb-1" 
          : "text-white hover:text-gray-300"
      }`}
    >
      {label}
    </Link>
  );
}