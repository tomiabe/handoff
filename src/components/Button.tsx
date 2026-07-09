import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

    const sizes = {
      sm: "h-7 px-3 text-[12px] rounded gap-1.5",
      md: "h-8 px-4 text-[13px] rounded-md gap-2",
    };

    const variants = {
      primary:
        "bg-white text-black hover:bg-white/90 active:bg-white/80",
      secondary:
        "bg-transparent text-foreground border border-border hover:bg-white/5 active:bg-white/10",
      ghost:
        "bg-transparent text-muted hover:text-foreground hover:bg-white/5",
      danger:
        "bg-status-failed/10 text-status-failed border border-status-failed/20 hover:bg-status-failed/20",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
