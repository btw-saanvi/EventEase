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
      <div ref={ref} className="relative w-full">
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
        "input-brutal flex items-center justify-between cursor-pointer text-left w-full",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className={cn("w-4 h-4 text-black transition-transform flex-shrink-0", open && "rotate-180")}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext);
  return <span className={value ? "text-black" : "text-black/50"}>{value || placeholder}</span>;
}

function SelectContent({ className, children, ...props }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-2 z-50 bg-white border-[3px] border-black shadow-[4px_4px_0px_#1E1E1E] overflow-auto max-h-60",
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
        "px-4 py-3 text-sm cursor-pointer font-body font-bold text-black border-b-[2px] last:border-b-0 border-black transition-colors hover:bg-oatly-yellow",
        selected === value && "bg-oatly-pink",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
