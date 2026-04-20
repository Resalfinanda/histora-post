"use client";

import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-2 min-w-min">
        <Badge
          variant={activeCategory === null ? "default" : "outline"}
          className={`cursor-pointer whitespace-nowrap shrink-0 ${
            activeCategory === null ? "bg-blue-500 hover:bg-blue-600" : ""
          }`}
          onClick={() => onCategoryChange(null)}
        >
          Semua
        </Badge>

        {categories.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`cursor-pointer whitespace-nowrap shrink-0 ${
              activeCategory === category
                ? "bg-blue-500 hover:bg-blue-600"
                : ""
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
