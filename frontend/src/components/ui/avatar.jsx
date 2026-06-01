import * as React from "react";
import { cn, getInitials } from "../../lib/utils";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-none border-[2px] border-black bg-white shadow-[2px_2px_0px_#1E1E1E]", className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => {
  const [error, setError] = React.useState(false);
  if (!src || error) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover rounded-none", className)}
      onError={() => setError(true)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, name, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-none bg-oatly-blue text-black text-xs font-heading uppercase",
      className
    )}
    {...props}
  >
    {name ? getInitials(name) : props.children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
