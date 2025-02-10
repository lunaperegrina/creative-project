import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import type { FieldError } from "react-hook-form";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface SearchableSelectProps {
  placeholder: string;
  options: SelectObject[];
  value: string | number | undefined;
  onChange: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
  error?: FieldError;
}

const SearchableSelect = React.forwardRef<HTMLButtonElement, SearchableSelectProps>(
  ({ placeholder, options, value, onChange, disabled = false, error, ...props }, ref) => {
    const [popover, setPopover] = useState<boolean>(false);

    return (
      <div>
        <Popover open={popover} onOpenChange={setPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("w-full justify-between", error && "border-red-500 focus-visible:ring-red-500")}
              disabled={disabled}
              {...props}
              ref={ref}
            >
              {value ? options.find((option) => option.value === value)?.label : placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Pesquisar..." />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandList className="h-36 overflow-y-scroll">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onChange(Number.parseInt(option.value));
                        setPopover(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
export default SearchableSelect;
