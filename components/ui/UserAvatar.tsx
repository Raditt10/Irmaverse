"use client";

import React, { useState } from "react";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({
  src,
  name,
  className = "",
  fallbackClassName = "",
  size = "md",
}: UserAvatarProps) {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  // Consistent pleasant background colors based on name initials
  const bgColors = [
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-cyan-100 text-cyan-700 border-cyan-200",
    "bg-sky-100 text-sky-700 border-sky-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  ];
  
  const charCode = (name || "A").charCodeAt(0);
  const colorScheme = bgColors[charCode % bgColors.length];

  if (!src || error) {
    return (
      <div
        className={`rounded-full border flex items-center justify-center font-black select-none shrink-0 ${colorScheme} ${currentSize} ${fallbackClassName || className}`}
      >
        {initial || <User className="w-1/2 h-1/2" strokeWidth={2.5} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "User Avatar"}
      onError={() => setError(true)}
      className={`rounded-full object-cover shrink-0 ${currentSize} ${className}`}
    />
  );
}

export default UserAvatar;
