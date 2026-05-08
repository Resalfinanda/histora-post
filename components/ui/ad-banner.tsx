"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface AdItem {
  id: string;
  imageUrl: string;
  adLink?: string;
}

interface AdBannerProps {
  size?: "small" | "medium" | "large" | "squareMedium";
  className?: string;
  width?: string;
  height?: string;
  imageUrl?: string;
  adLink?: string;
  ads?: AdItem[];
  interval?: number;
  altText?: string;
  isClickable?: boolean;
  placement?: string;
  topic?: string;
}
const EMPTY_ADS: AdItem[] = [];

export function AdBanner({
  size = "medium",
  className = "",
  width,
  height,
  imageUrl,
  adLink,
  ads = EMPTY_ADS,
  interval = 7000,
  altText = "Advertisement",
  isClickable = true,
  placement,
  topic,
}: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayAds, setDisplayAds] = useState<AdItem[]>([]);
  const [isLoading, setIsLoading] = useState(!!placement);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sizeClasses = {
    //Banner Persegi panjang
    small: "h-[90px] md:h-[128px]",
    medium: "h-[90px] md:h-[192px]",
    large: "h-[90px] md:h-[256px]",

    //Poster Persegi
    squareMedium: "h-[384px]",
  };

  const heightClass = height || sizeClasses[size];
  const widthClass = width || "w-full";

  useEffect(() => {
    // Handle static ads case (no placement)
    if (!placement) {
      const staticAds =
        ads.length > 0
          ? ads
          : imageUrl
            ? [{ id: "static-1", imageUrl, adLink }]
            : [];
      setDisplayAds(staticAds);
      setIsLoading(false);
      return;
    }

    // Handle dynamic ads case (with placement)
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchDynamicAds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = `/api/advertisements?placement=${encodeURIComponent(
          placement,
        )}&isActive=true`;
        if (topic) {
          query += `&topic=${encodeURIComponent(topic)}`;
        }

        const response = await fetch(query, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ads: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid ads data format");
        }

        setDisplayAds(data.length > 0 ? data : []);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            return;
          }
          console.error("Error fetching dynamic ads:", error.message);
          setError(error.message);
        } else {
          console.error("Unknown error fetching ads:", error);
          setError("Failed to load advertisements");
        }

        // Fallback to static ads
        const staticAds =
          ads.length > 0
            ? ads
            : imageUrl
              ? [{ id: "static-1", imageUrl, adLink }]
              : [];
        setDisplayAds(staticAds);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDynamicAds();

    return () => {
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [placement, topic, ads, imageUrl, adLink]);

  // Auto-carousel
  useEffect(() => {
    if (displayAds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayAds.length);
    }, interval);

    return () => clearInterval(timer);
  }, [displayAds.length, interval]);

  // Handle ad click
  const handleAdClick = (ad: AdItem) => {
    if (ad.id && ad.id !== "static-1") {
      fetch(`/api/advertisements/${encodeURIComponent(ad.id)}/click`, {
        method: "POST",
      }).catch((err) => console.error("Failed to track ad click:", err));
    }

    if (isClickable && ad.adLink && isValidUrl(ad.adLink)) {
      window.open(ad.adLink, "_blank", "noopener,noreferrer");
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      console.warn("Invalid URL:", url);
      return false;
    }
  };

  if (isLoading && displayAds.length === 0) {
    return (
      <div
        className={`relative block overflow-hidden rounded-lg bg-gray-100 ${widthClass} ${heightClass} ${className}`}
        role="status"
        aria-busy="true"
        aria-label="Loading advertisements"
      >
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-100 via-gray-50 to-gray-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-4 w-20 mx-auto mb-2 rounded bg-gray-300 animate-pulse" />
            <p className="text-xs text-gray-400">Loading ads...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && displayAds.length === 0) {
    return (
      <div
        className={`relative block overflow-hidden rounded-lg bg-yellow-50 border-2 border-yellow-200 ${widthClass} ${heightClass} ${className}`}
        role="alert"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-4">
            <p className="text-sm text-yellow-800 font-medium">
              Ad space unavailable
            </p>
            <p className="text-xs text-yellow-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (displayAds.length > 0) {
    return (
      <div
        className={`relative block overflow-hidden rounded-lg bg-gray-100 ${widthClass} ${heightClass} ${className}`}
        role="region"
        aria-label="Advertisement carousel"
      >
        {displayAds.map((ad, index) => {
          const isCurrent = index === currentIndex;

          return (
            <div
              key={ad.id}
              onClick={() => handleAdClick(ad)}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isClickable && ad.adLink && isValidUrl(ad.adLink)
                  ? "cursor-pointer"
                  : ""
              } ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              role={isCurrent ? "img" : undefined}
              aria-label={
                isCurrent
                  ? `Advertisement ${index + 1} of ${displayAds.length}`
                  : undefined
              }
            >
              <Image
                src={ad.imageUrl}
                alt={altText}
                fill
                className="object-cover hover:opacity-90 transition-opacity duration-300"
                onError={(error) => {
                  console.error(`Failed to load image for ad ${ad.id}:`, error);
                }}
              />
            </div>
          );
        })}

        {displayAds.length > 1 && (
          <div
            className="absolute bottom-2 left-0 right-0 z-20 flex justify-center space-x-1.5"
            role="tablist"
            aria-label="Ad selection"
          >
            {displayAds.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    setCurrentIndex((prev) =>
                      prev === 0 ? displayAds.length - 1 : prev - 1,
                    );
                  } else if (e.key === "ArrowRight") {
                    setCurrentIndex((prev) => (prev + 1) % displayAds.length);
                  }
                }}
                className={`w-1.5 h-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to ad ${index + 1}`}
                aria-selected={index === currentIndex}
                role="tab"
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
        isClickable && adLink && isValidUrl(adLink)
          ? "cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors"
          : ""
      }`}
      onClick={() => {
        if (adLink && isValidUrl(adLink)) {
          const ad: AdItem = { id: "fallback", imageUrl: "", adLink };
          handleAdClick(ad);
        }
      }}
      role="presentation"
    >
      <div className="text-center">
        <p className="text-gray-500 font-semibold">ad space</p>
      </div>
    </div>
  );
}
