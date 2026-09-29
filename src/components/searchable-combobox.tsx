"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = { value: string; label: string; flag?: string };

type Props = {
  label: string;
  value: string;
  options: ComboboxOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
  visuallyHiddenLabel?: boolean;
  triggerClassName?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();
}

export function SearchableCombobox({
  label,
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  onChange,
  disabled,
  hint,
  visuallyHiddenLabel = false,
  triggerClassName = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const query = normalize(search.trim());
  const matches = query
    ? options
        .filter((option) =>
          normalize(`${option.label} ${option.value}`).includes(query),
        )
        .slice(0, 80)
    : options.slice(0, 80);

  function choose(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="min-w-0">
      <span
        className={
          visuallyHiddenLabel
            ? "sr-only"
            : "mb-1.5 block text-xs font-semibold text-[#292e39]"
        }
      >
        {label}
      </span>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-label={label}
            aria-expanded={open}
            aria-controls={listId}
            disabled={disabled}
            className={`flex h-9 w-full min-w-0 items-center gap-2 border border-[#d9dde5] bg-white px-3 text-left text-xs text-[#303746] transition-[border-color,box-shadow] duration-200 hover:border-primary/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-[#f6f7fa] disabled:text-[#9aa1b0] ${triggerClassName}`}
          >
            {selected?.flag && (
              <span
                aria-hidden="true"
                className={`fi fi-${selected.flag.toLowerCase()} shrink-0 text-base leading-none`}
              />
            )}
            <span className="min-w-0 flex-1 truncate">
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`size-3.5 shrink-0 text-[#6b7280] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-[var(--radix-popover-trigger-width)] min-w-52 rounded-none border border-[#d9dde5] bg-white p-1 shadow-[0_14px_38px_rgba(34,48,105,0.14)]"
        >
          <CommandPrimitive shouldFilter={false} className="flex flex-col">
            <div className="flex h-9 items-center gap-2 border-b border-[#e5e8ee] px-2">
              <Search aria-hidden="true" className="size-3.5 text-[#7a8294]" />
              <CommandPrimitive.Input
                value={search}
                onValueChange={setSearch}
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#9aa1b0]"
              />
            </div>
            <CommandPrimitive.List
              id={listId}
              className="max-h-56 overflow-y-auto py-1"
            >
              {!search && value && (
                <CommandPrimitive.Item
                  value="clear-selection"
                  onSelect={() => choose("")}
                  className="cursor-pointer px-2 py-2 text-xs text-[#788197] outline-none data-[selected=true]:bg-[#f0f3fd]"
                >
                  {placeholder}
                </CommandPrimitive.Item>
              )}
              {matches.map((option) => (
                <CommandPrimitive.Item
                  key={option.value}
                  value={option.value}
                  onSelect={() => choose(option.value)}
                  className="flex cursor-pointer items-center gap-2 px-2 py-2 text-xs text-[#303746] outline-none transition-colors duration-150 data-[selected=true]:bg-[#f0f3fd] data-[selected=true]:text-primary"
                >
                  {option.flag && (
                    <span
                      aria-hidden="true"
                      className={`fi fi-${option.flag.toLowerCase()} shrink-0 text-base leading-none`}
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check
                      aria-hidden="true"
                      className="size-3.5 text-primary"
                    />
                  )}
                </CommandPrimitive.Item>
              ))}
              {!matches.length && (
                <p className="px-2 py-5 text-center text-xs text-[#788197]">
                  {emptyMessage}
                </p>
              )}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
      {hint && (
        <span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{hint}</span>
      )}
    </div>
  );
}
