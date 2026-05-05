"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function SearchBar({
  isMobile = false,
  isOpen: externalIsOpen,
  onOpenChange,
}: SearchBarProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const isOpen = externalIsOpen ?? localIsOpen;
  const setIsOpen = onOpenChange ?? setLocalIsOpen;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      if (isMobile) setIsOpen(false);
    }
  };

  // Tampilan Desktop - Sesuai gambar (selalu tampil & rounded)
  if (!isMobile) {
    return (
      <form onSubmit={handleSearch} className="relative w-full max-w-lg">
        <Input
          type="text"
          placeholder="Search....."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-4 pr-10 rounded-full bg-transparent border-white/40 text-white placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-white/50"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-300"
        >
          <Search className="h-5 w-5 text-white" />
        </button>
      </form>
    );
  }

  // Tampilan Mobile - Ikon Toggle
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      className="hover:bg-transparent"
    >
      <Search className="h-5 w-5 text-background" />
    </Button>
  );
}

// Mobile Search Input Component (Tetap sama)
export function MobileSearchInput({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full border-b border-white/10 px-4 py-3 bg-[#0f172a]">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search....."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 h-10 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          autoFocus
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            onClose();
            setQuery("");
          }}
          className="hover:bg-transparent"
        >
          <X className="h-5 w-5 text-white" />
        </Button>
      </form>
    </div>
  );
}