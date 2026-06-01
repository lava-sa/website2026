"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  variant?: "light" | "dark";
  /** Extra classes on the input element */
  inputClassName?: string;
  /** Show lock icon on the left (account / admin forms) */
  leadingIcon?: boolean;
};

/**
 * Password field with show/hide toggle — use on every login or password form.
 */
export default function PasswordInput({
  variant = "light",
  inputClassName = "",
  leadingIcon = false,
  id,
  disabled,
  ...inputProps
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const isDark = variant === "dark";

  const baseInput =
    "w-full border py-3 text-sm focus:outline-none transition-colors disabled:opacity-50";
  const themeInput = isDark
    ? "border-white/20 bg-petrol-900 text-white placeholder:text-white/40 focus:border-secondary focus:ring-1 focus:ring-secondary"
    : "border-border bg-white text-copy focus:border-primary";
  const padInput = leadingIcon ? "pl-10 pr-11" : "px-4 pr-11";

  return (
    <div className="relative">
      <input
        {...inputProps}
        id={id}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={`${baseInput} ${themeInput} ${padInput} ${inputClassName}`.trim()}
      />
      {leadingIcon && (
        <Lock
          className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
            isDark ? "text-white/40" : "text-copy-muted"
          }`}
          aria-hidden
        />
      )}
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={id}
        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 ${
          isDark
            ? "text-white/50 hover:text-white"
            : "text-copy-muted hover:text-primary"
        }`}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
