import * as React from "react";
import { cn } from "../../lib/utils";

const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "shrink-0 bg-black",
      orientation === "horizontal" ? "h-[3px] w-full" : "w-[3px] h-full",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
