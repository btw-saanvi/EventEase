import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vapor-lavender/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 text-white shadow-lg hover:shadow-violet-500/25 hover:shadow-xl hover:-translate-y-0.5",
        outline: "border border-vapor-border bg-vapor-card text-vapor-lavender hover:border-vapor-lavender/40 hover:bg-white/5",
        ghost: "text-slate-400 hover:text-vapor-lavender hover:bg-white/5",
        destructive: "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30",
        secondary: "bg-white/5 border border-vapor-border text-slate-300 hover:border-vapor-lavender/30 hover:text-vapor-lavender",
        vapor: "btn-vapor",
        "vapor-solid": "btn-vapor-solid",
        link: "text-vapor-lavender underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
