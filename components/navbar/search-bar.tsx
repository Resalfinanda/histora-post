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
      setIsOpen(false);
    }
  };

  // Desktop version - inline
  if (!isMobile) {
    return (
      <div className="flex items-center gap-2">
        {isOpen ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Cari artikel..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-48 md:w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="hover:bg-transparent"
            >
              <X className="h-5 w-5 text-white" />
            </Button>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="hover:bg-transparent"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>
    );
  }

  // Mobile version - just icon
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      className="hover:bg-transparent"
    >
      <Search className="h-5 w-5 text-white" />
    </Button>
  );
}

// Mobile Search Input Component
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
    <div className="w-full  border-b border-white/10 px-4 py-3">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Cari artikel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 h-10 w-full bg-white/10 border-blue-900 text-black placeholder:text-gray-400"
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
          <X className="h-5 w-5 text-black" />
        </Button>
      </form>
    </div>
  );
}
