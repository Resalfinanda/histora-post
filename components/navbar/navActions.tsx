"use client";

import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
//import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
//import Link from "next/link";
//import { NAV_ITEMS } from "@/lib/navData";

export function NavbarActions() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col gap-1 hover:bg-transparent hover:text-gray-300 "
        onClick={toggleTheme}
      >
        <Sun className="h-5 w-5 hidden dark:block text-white" />
        <Moon className="h-5 w-5 block dark:hidden text-white" />
        <p className="text-[10px] font-medium text-white dark:hidden">Gelap</p>
        <p className="text-[10px] font-medium text-white hidden dark:block">Terang</p>
      </Button>

      {/* Hamburger Menu Mobile (Opsional, untuk menu ekstra jika diperlukan) */}
      {/* <div className="lg:hidden">
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
          <SheetContent side="right" className="bg-background text-foreground">
            <div className="flex flex-col gap-4 mt-6 ml-6">
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-base font-medium hover:text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div> */}
    </div>
  );
}
