import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      {/* Clica fora para fechar (opcional) */}
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      {/* Passa a função de fechar para os filhos */}
      {React.Children.map(children, child => 
        React.cloneElement(child, { onClose: () => onOpenChange(false) })
      )}
    </div>
  );
};

export const DialogContent = ({ className = "", children, onClose }) => (
  <div className={`relative z-50 grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}>
    {children}
    <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">✕</button>
  </div>
);

export const DialogHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>{children}</div>
);

export const DialogTitle = ({ className = "", children }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>
);