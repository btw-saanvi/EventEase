import * as React from "react";
import { cn } from "../../lib/utils";

const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "shrink-0",
      orientation === "horizontal" ? "divider-vapor w-full" : "w-px h-full bg-vapor-border",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
