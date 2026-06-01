import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-heading uppercase tracking-wider border-[3px] border-black transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-oatly-yellow text-black shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#1E1E1E]",
        outline: "bg-white text-black shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#1E1E1E]",
        ghost: "border-transparent text-black hover:bg-black/5 hover:border-black",
        destructive: "bg-red-400 text-black shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#1E1E1E]",
        secondary: "bg-oatly-blue text-black shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#1E1E1E]",
        vapor: "bg-white text-black shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#1E1E1E]",
        "vapor-solid": "bg-oatly-yellow text-black shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#1E1E1E]",
        link: "border-transparent text-black underline underline-offset-4 hover:text-oatly-pink",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-12 w-12",
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
