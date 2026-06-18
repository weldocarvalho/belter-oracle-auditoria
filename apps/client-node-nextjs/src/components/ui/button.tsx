import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "link" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Universal Base Styles
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50",
          
          // Layout Design Variants Matrix
          variant === "default" && "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 shadow-sm dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
          variant === "outline" && "border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
          variant === "ghost" && "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
          variant === "link" && "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
          
          // Layout Dimensional Sizing Matrix
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
