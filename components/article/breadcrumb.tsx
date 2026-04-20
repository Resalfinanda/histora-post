"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: Array<{ label: string; href: string }>;
  currentPage: string;
}

export function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Link
            href={item.href}
            className="hover:text-blue-400 transition-colors"
          >
            {item.label}
          </Link>
          <ChevronRight className="w-4 h-4" />
        </div>
      ))}
      <span className="text-foreground">{currentPage}</span>
    </nav>
  );
}
