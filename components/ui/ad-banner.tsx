"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface AdItem {
  imageUrl: string;
  adLink?: string;
}

interface AdBannerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  width?: string;
  height?: string;
  imageUrl?: string;
  adLink?: string;
  ads?: AdItem[];
  interval?: number;
  altText?: string;
  isClickable?: boolean;
}

export function AdBanner({
  size = "medium",
  className = "",
  width,
  height,
  imageUrl,
  adLink,
  ads = [],
  interval = 5000,
  altText = "Advertisement",
  isClickable = true,
}: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sizeClasses = {
    small: "h-24",
    medium: "h-24 md:h-48",
    large: "h-24 md:h-48",
  };

  const heightClass = height || sizeClasses[size];
  const widthClass = width || "w-full";

  const displayAds =
    ads.length > 0 ? ads : imageUrl ? [{ imageUrl, adLink }] : [];

  useEffect(() => {
    if (displayAds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayAds.length);
    }, interval);

    return () => clearInterval(timer);
  }, [displayAds.length, interval]);

  const handleAdClick = (link?: string) => {
    if (isClickable && link) {
      window.open(link, "_blank");
    }
  };

  if (displayAds.length > 0) {
    return (
      <div
        className={`relative block overflow-hidden rounded-lg bg-gray-100 ${widthClass} ${heightClass} ${className}`}
      >
        {displayAds.map((ad, index) => {
          const isCurrent = index === currentIndex;

          return (
            <div
              key={index}
              onClick={() => handleAdClick(ad.adLink)}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isClickable && ad.adLink ? "cursor-pointer" : ""
              } ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <Image
                src={ad.imageUrl}
                alt={altText}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          );
        })}

        {displayAds.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center space-x-1.5">
            {displayAds.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation(); 
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 ${widthClass} ${heightClass} ${className} ${
        isClickable && adLink
          ? "cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors"
          : ""
      }`}
      onClick={() => handleAdClick(adLink)}
    >
      <div className="text-center">
        <p className="text-gray-500 font-semibold">ad space</p>
      </div>
    </div>
  );
}
