import * as React from "react";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef(({ className, value, color, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-6 w-full bg-white border-[3px] border-black shadow-[2px_2px_0px_#1E1E1E]", className)}
    {...props}
  >
    <div
      className="h-full transition-all duration-500 ease-out border-r-[3px] border-black bg-oatly-pink"
      style={{
        width: `${Math.min(100, Math.max(0, value || 0))}%`,
        backgroundColor: color || "#FFB0C2", // Default to oatly pink
      }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
