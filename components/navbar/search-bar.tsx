"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Search, X, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

function DateRangeFilterButton({ query }: { query: string }) {
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (!range?.from) {
      setOpen(false);
      return;
    }

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    params.set("startDate", format(range.from, "yyyy-MM-dd"));

    if (range.to) {
      params.set("endDate", format(range.to, "yyyy-MM-dd"));
    }

    router.push(`/search?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Filter tanggal"
          className="h-10 w-10 text-white hover:bg-white/10 hover:rounded-full hover:text-white "
        >
          <CalendarDays className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-4 bg-white">
        <Calendar mode="range" selected={range} onSelect={setRange} />
        <div className="mt-3 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRange(undefined)}
          >
            Reset
          </Button>
          <Button type="button" size="sm" onClick={handleApply}>
            Terapkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
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

  if (!isMobile) {
    return (
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-lg items-center gap-2"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search....."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-full border-white/40 bg-transparent pl-4 pr-20 text-white placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-white/50"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <button
              type="submit"
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:text-gray-300"
            >
              <Search className="h-4 w-4 text-white" />
            </button>
            <DateRangeFilterButton query={query} />
          </div>
        </div>
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open Search"
      onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col gap-1 hover:bg-transparent"
    >
      <Search className="h-5 w-5 text-white" />
      <p className="text-[10px] font-medium text-white">Search</p>
    </Button>
  );
}

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
    <div className="w-full border-b border-white/10 bg-[#0f172a] px-4 py-3">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search....."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 flex-1 w-full border-white/20 bg-white/10 text-white placeholder:text-gray-400"
          autoFocus
        />
        <DateRangeFilterButton query={query} />
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
