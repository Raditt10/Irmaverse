"use client";

import React, { useState } from "react";
import { 
  User, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Trophy, 
  Medal, 
  Newspaper,
  LucideIcon 
} from "lucide-react";

export type ContentType = "kajian" | "kegiatan" | "program" | "lomba" | "berita" | "event" | "news" | "competition";

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  fallbackType?: "avatar" | "thumbnail";
  type?: "avatar" | "thumbnail";
  contentType?: ContentType | string;
  icon?: LucideIcon;
  fallbackName?: string;
  name?: string;
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackType = "thumbnail",
  type,
  contentType = "kajian",
  icon: CustomIcon,
  fallbackName,
  name,
  fallbackClassName = "",
  className = "",
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const resolvedType = type || fallbackType;
  const resolvedName = name || fallbackName;

  // Helper untuk menentukan icon dan tema warna berdasarkan konten
  const getContentConfig = () => {
    if (CustomIcon) return { icon: CustomIcon, label: "" };
    
    const key = (contentType || "").toLowerCase();
    if (key.includes("program") || key.includes("kurikulum")) {
      return { icon: GraduationCap, label: "Program Kurikulum" };
    }
    if (key.includes("kegiatan") || key.includes("event") || key.includes("schedule")) {
      return { icon: Calendar, label: "Kegiatan" };
    }
    if (key.includes("lomba") || key.includes("kompetisi") || key.includes("competition")) {
      return { icon: Trophy, label: "Info Perlombaan" };
    }
    if (key.includes("berita") || key.includes("news")) {
      return { icon: Newspaper, label: "Berita" };
    }
    // Default kajian / materi
    return { icon: BookOpen, label: "Kajian" };
  };

  // If no src provided or image load failed, render fallback
  if (!src || error) {
    if (resolvedType === "avatar") {
      const initial = (resolvedName || alt || "?").trim().charAt(0).toUpperCase();
      return (
        <div
          className={`flex items-center justify-center font-black select-none bg-emerald-500 text-white text-2xl md:text-3xl ${fallbackClassName || className}`}
        >
          {initial || <User className="w-1/2 h-1/2" strokeWidth={2.5} />}
        </div>
      );
    }

    // Thumbnail fallback with adaptive icon
    const config = getContentConfig();
    const ContentIcon = config.icon;

    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 text-white select-none relative overflow-hidden ${fallbackClassName || className}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20">
          <ContentIcon className="w-6 h-6 text-emerald-200" strokeWidth={2.5} />
        </div>
        {resolvedName && (
          <span className="text-xs font-black text-white/90 max-w-[85%] truncate text-center px-3 py-0.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
            {resolvedName}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

export default SafeImage;
