"use client";

import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,SheetDescription } from "@/components/ui/sheet";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navData";
import { SearchBar } from "./search-bar";

interface NavbarActionsProps {
  isMobileSearchOpen: boolean;
  onMobileSearchChange: (isOpen: boolean) => void;
}

export function NavbarActions({
  isMobileSearchOpen,
  onMobileSearchChange,
}: NavbarActionsProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-2">
        <SearchBar isMobile={false} />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent"
          onClick={toggleTheme}
        >
          {/* CSS-based toggle (NO hydration issue) */}
          <Sun className="h-5 w-5 hidden dark:block text-background" />
          <Moon className="h-5 w-5 block dark:hidden text-background" />
        </Button>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="hover:bg-transparent"
              >
                <Menu className="h-6 w-6 text-background" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background text-foreground"
            >
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
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center gap-2">
        <SearchBar
          isMobile={true}
          isOpen={isMobileSearchOpen}
          onOpenChange={onMobileSearchChange}
        />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent"
          onClick={toggleTheme}
        >
          <Sun className="h-5 w-5 hidden dark:block text-background" />
          <Moon className="h-5 w-5 block dark:hidden text-background" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="hover:bg-transparent"
            >
              <Menu className="h-6 w-6 text-background" />
            </Button>
          </SheetTrigger>

          {/* ✅ pakai token, bukan HEX */}
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
      </div>
    </div>
  );
}
