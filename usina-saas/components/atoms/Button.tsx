"use client";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost";
}

export function Button({
  loading,
  variant = "primary",
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-brand-primary text-white hover:bg-red-500",
    ghost:
      "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}
