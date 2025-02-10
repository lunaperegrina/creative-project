import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [view, setView] = React.useState<boolean>(false);

  return (
    <div
      className={cn(
        "border-input ring-offset-background focus-within:ring-ring flex h-9 items-center rounded-md border pr-3 text-sm focus-within:ring-1 focus-within:ring-offset-2",
        className
      )}
    >
      <input
        type={view ? "text" : "password"}
        className={cn(
          "flex h-9 border border-x-0 w-full bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none",
          className
        )}
        ref={ref}
        {...props}
      />
      {!view && <Eye className="h-[16px] w-[16px] cursor-pointer" onClick={() => setView(true)} />}
      {view && <EyeOff className="h-[16px] w-[16px] cursor-pointer" onClick={() => setView(false)} />}
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
