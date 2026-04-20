"use client";

import { Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 my-6 p-4 bg-transparent rounded-lg">
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Share2 className="w-4 h-4" />
        Bagikan:
      </span>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-foreground transition-colors"
        title="Bagikan ke Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-sky-400 hover:bg-sky-500 text-foreground transition-colors"
        title="Bagikan ke Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-foreground transition-colors"
        title="Bagikan ke LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>

      <Button
        onClick={handleCopyLink}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Disalin!" : "Salin Link"}
      </Button>
    </div>
  );
}
