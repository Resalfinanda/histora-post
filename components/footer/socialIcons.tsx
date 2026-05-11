import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
        <Button key={i} size="icon" aria-label="Social media Icon" className="bg-transparent">
          <Icon className="h-4 w-4 text-white hover:text-blue-400" />
        </Button>
      ))}
    </div>
  );
}
