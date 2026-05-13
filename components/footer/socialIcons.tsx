import { Facebook, Music2, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialMediaLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

export function SocialIcons() {
  const socialMediaLinks: SocialMediaLink[] = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/share/1C128XFDKS/?mibextid=wwXIfr",
    },
    {
      name: "Tik Tok",
      icon: Music2,
      url: "https://www.tiktok.com/@historapost?_r=1&_t=ZS-96K2uGxfrWO",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/historapost_?igsh=MjR4b2YyeXJoeG9v&utm_source=qr",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {socialMediaLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Kunjungi ${social.name}`}
          >
            <Button
              size="icon"
              className="bg-transparent hover:bg-white/10 transition-colors"
            >
              <Icon className="h-4 w-4 text-white hover:text-blue-400" />
            </Button>
          </a>
        );
      })}
    </div>
  );
}
