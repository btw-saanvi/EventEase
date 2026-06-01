import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-none px-2 py-0.5 text-[10px] font-heading uppercase tracking-wider border-[2px] border-black shadow-[2px_2px_0px_#1E1E1E]",
  {
    variants: {
      variant: {
        default: "bg-oatly-yellow text-black",
        lavender: "bg-oatly-blue text-black",
        blue: "bg-oatly-blue text-black",
        cyan: "bg-oatly-blue text-black",
        pink: "bg-oatly-pink text-black",
        green: "bg-oatly-green text-black",
        red: "bg-red-400 text-black",
        yellow: "bg-oatly-yellow text-black",
        outline: "bg-white text-black",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
