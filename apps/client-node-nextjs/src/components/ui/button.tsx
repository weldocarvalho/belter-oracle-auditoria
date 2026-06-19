import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "link" | "ghost" | "conversion";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          
          // Tailwind v4 Explicit Theme Colors Mapping
          variant === "default" && "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
          variant === "conversion" && "bg-secondary text-secondary-foreground font-bold hover:opacity-95 shadow-lg",
          variant === "outline" && "border border-border bg-background text-foreground hover:bg-muted",
          variant === "ghost" && "hover:bg-muted text-foreground",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          
          // Layout Sizes
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-lg px-3",
          size === "lg" && "h-12 rounded-xl px-8 text-base",
          size === "icon" && "h-10 w-10 shrink-0",
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
