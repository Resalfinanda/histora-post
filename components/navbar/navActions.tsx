"use client";

import { Search, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navData";

export function NavbarActions() {
  return (
    <div className="flex items-center gap-2">
      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Search className="h-5 w-5 text-white" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Moon className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden ">
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Moon className="h-5 w-5 text-white" />
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="hover:bg-transparent"
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-[#1E2A44] text-white">
            <div className="flex flex-col gap-4 mt-6 ml-6">
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-base font-medium hover:text-gray-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
