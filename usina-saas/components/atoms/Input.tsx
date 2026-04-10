"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="relative">
        <input
          ref={ref}
          type={isPassword && showPassword ? "text" : type}
          className={`
            w-full rounded-lg border bg-bg-elevated px-4 py-2.5 text-sm text-white
            placeholder:text-zinc-500 outline-none transition-colors
            focus:border-brand-primary
            ${error ? "border-error" : "border-zinc-700"}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            tabIndex={-1}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
