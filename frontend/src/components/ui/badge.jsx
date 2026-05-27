import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors",
  {
    variants: {
      variant: {
        default: "badge-lavender",
        lavender: "badge-lavender",
        cyan: "badge-cyan",
        pink: "badge-pink",
        green: "badge-green",
        red: "badge-red",
        yellow: "badge-yellow",
        outline: "border-vapor-border text-slate-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
