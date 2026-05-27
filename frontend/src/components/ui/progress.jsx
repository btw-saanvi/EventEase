import * as React from "react";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef(({ className, value, color, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/10", className)}
    {...props}
  >
    <div
      className="h-full rounded-full transition-all duration-500 ease-out"
      style={{
        width: `${Math.min(100, Math.max(0, value || 0))}%`,
        background: color || "linear-gradient(90deg, #7c3aed, #6366f1, #67e8f9)",
      }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
