// components/footer/SocialIcons.tsx
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
        <Button
          key={i}
          variant="ghost"
          size="icon"
          className="bg-white/10 hover:bg-white/20 hover:rounded-lg"
        >
          <Icon className="h-4 w-4 text-background" />
        </Button>
      ))}
    </div>
  );
}
