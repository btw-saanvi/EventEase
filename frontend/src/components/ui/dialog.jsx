import * as React from "react";
import { cn } from "../../lib/utils";

// Simple Dialog built with native HTML + CSS (no Radix dependency)
const DialogContext = React.createContext({});

function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
          {/* Content rendered via DialogContent */}
          {React.Children.map(children, (child) =>
            child?.type === DialogContent ? child : null
          )}
        </div>
      )}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ asChild, children, ...props }) {
  const { onOpenChange } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e);
        onOpenChange(true);
      },
    });
  }
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

function DialogContent({ className, children, ...props }) {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div
      className={cn(
        "relative z-50 w-full max-w-lg glass-card animate-slide-in-up max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors text-xl leading-none z-10"
        aria-label="Close"
      >
        ×
      </button>
      {children}
    </div>
  );
}

function DialogHeader({ className, ...props }) {
  return <div className={cn("mb-4", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("font-heading text-xl font-semibold text-slate-100", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-400 mt-1", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex gap-3 justify-end mt-6 pt-4 border-t border-vapor-border", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
