"use client";

import Image from "next/image";

interface AdBannerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  width?: string; // Custom width (e.g., "w-full", "w-96")
  height?: string; // Custom height (e.g., "h-48", "h-80")
  imageUrl?: string; // URL gambar iklan
  adLink?: string; // URL tujuan ketika iklan diklik
  altText?: string; // Alt text untuk gambar
  isClickable?: boolean; // Enable/disable clickable behavior
}

export function AdBanner({
  size = "medium",
  className = "",
  width,
  height,
  imageUrl,
  adLink,
  altText = "Advertisement",
  isClickable = true,
}: AdBannerProps) {
  const sizeClasses = {
    small: "h-24",
    medium: "h-24 md:h-48",
    large: "h-24 md:h-64",
  };

  // Gunakan custom dimensions jika diberikan, atau gunakan size preset
  const heightClass = height || sizeClasses[size];
  const widthClass = width || "w-full";

  const handleAdClick = () => {
    if (isClickable && adLink) {
      // Buka link di tab baru
      window.open(adLink, "_blank");
    }
  };

  // Jika ada imageUrl, tampilkan sebagai gambar, jika tidak tampilkan placeholder
  if (imageUrl) {
    return (
      <a
        href={adLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block overflow-hidden rounded-lg ${widthClass} ${heightClass} ${className}`}
        // onClick={(e) => {
        //   if (!isClickable) {
        //     e.preventDefault();
        //   }
        // }}
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-conver hover:opacity-90 transition-opacity"
        />
      </a>
    );
  }

  return (
    <div
      className={`bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 ${widthClass} ${heightClass} ${className} ${isClickable && adLink ? "cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors" : ""}`}
      onClick={handleAdClick}
    >
      <div className="text-center">
        <p className="text-gray-500 font-semibold">ad space</p>
      </div>
    </div>
  );
}
