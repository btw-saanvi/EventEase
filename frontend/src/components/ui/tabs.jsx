import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext({});

function Tabs({ value, onValueChange, defaultValue, children, className, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue || "");
  const active = value !== undefined ? value : internal;
  const setActive = onValueChange || setInternal;

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 bg-white border-[3px] border-black p-2 shadow-[4px_4px_0px_#1E1E1E] mb-6",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ value, className, ...props }) {
  const { active, setActive } = React.useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "px-4 py-2 text-sm font-heading uppercase transition-all duration-150 border-[2px] border-transparent text-black",
        isActive
          ? "bg-oatly-pink border-black shadow-[2px_2px_0px_#1E1E1E] -translate-y-[2px]"
          : "hover:bg-oatly-yellow hover:border-black hover:shadow-[2px_2px_0px_#1E1E1E] hover:-translate-y-[2px]",
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
    <div className={cn("animate-fade-in w-full", className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
