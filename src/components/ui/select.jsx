import React, { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";

const SelectContext = createContext({});

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ className = "", children }) => {
  const { setOpen, open } = useContext(SelectContext);
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  // Se houver valor, tenta mostrar o children correspondente se for passado, senão mostra o valor
  return <span className="block truncate">{value || placeholder}</span>;
};

export const SelectContent = ({ children }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-popover-foreground shadow-md">
      <div className="p-1">{children}</div>
    </div>
  );
};

export const SelectItem = ({ value, children }) => {
  const { onValueChange, setOpen } = useContext(SelectContext);
  return (
    <div
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
    >
      <span className="truncate">{children}</span>
    </div>
  );
};