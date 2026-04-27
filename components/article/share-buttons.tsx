"use client";

import { Share2, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  url: string;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("fill-current", className)}
  >
    <title>X</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 my-4 p-4 rounded-xl bg-transparent">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mr-2">
        <Share2 className="w-4 h-4" />
        <span>BAGIKAN</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke Facebook"
          className="p-2.5 rounded-full bg-[#1877F2] hover:opacity-90 text-white transition-all hover:scale-110"
        >
          <Facebook className="w-4 h-4 fill-current" />
        </a>

        {/* X  */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke X"
          className="p-2.5 rounded-full bg-black hover:opacity-90 text-white transition-all hover:scale-110"
        >
          <XIcon className="w-4 h-4" />
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke LinkedIn"
          className="p-2.5 rounded-full bg-[#0077B5] hover:opacity-90 text-white transition-all hover:scale-110"
        >
          <Linkedin className="w-4 h-4 fill-current" />
        </a>
      </div>

      <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

      <Button
        onClick={handleCopyLink}
        variant="secondary"
        size="sm"
        className={cn(
          "ml-auto sm:ml-0 transition-all duration-300 gap-2",
          copied &&
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Tersalin</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Salin Link</span>
          </>
        )}
      </Button>
    </div>
  );
}
