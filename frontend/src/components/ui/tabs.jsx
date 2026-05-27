import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext({});

function Tabs({ value, onValueChange, defaultValue, children, className, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue || "");
  const active = value !== undefined ? value : internal;
  const setActive = onValueChange || setInternal;

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-white/5 border border-vapor-border p-1",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ value, className, ...props }) {
  const { active, setActive } = React.useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
        active === value
          ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ value, className, children, ...props }) {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return (
    <div className={cn("animate-fade-in", className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
