import * as React from "react";
import { cn } from "../../lib/utils";

const SelectContext = React.createContext({});

function Select({ value, onValueChange, children }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "input-vapor flex items-center justify-between cursor-pointer text-left",
        open && "border-vapor-lavender/50 shadow-[0_0_0_3px_rgba(196,181,253,0.1)]",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className={cn("w-4 h-4 text-slate-400 transition-transform flex-shrink-0", open && "rotate-180")}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext);
  return <span className={value ? "text-slate-200" : "text-slate-500"}>{value || placeholder}</span>;
}

function SelectContent({ className, children, ...props }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-1 z-50 glass rounded-xl border border-vapor-border shadow-xl overflow-auto max-h-60 animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({ value, children, className, ...props }) {
  const { value: selected, onValueChange, setOpen } = React.useContext(SelectContext);
  return (
    <div
      onClick={() => { onValueChange(value); setOpen(false); }}
      className={cn(
        "px-3 py-2 text-sm cursor-pointer transition-colors text-slate-300 hover:text-vapor-lavender hover:bg-white/5",
        selected === value && "text-vapor-lavender bg-vapor-lavender/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
