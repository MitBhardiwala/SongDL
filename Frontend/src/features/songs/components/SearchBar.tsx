import { useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isFetching?: boolean;
  placeholder?: string;
  id?: string;
}

export function SearchBar({
  value,
  onChange,
  isFetching = false,
  placeholder = "Search songs…",
  id = "search-bar",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onChange("");
      inputRef.current?.blur();
    }
  };

  return (
    <div role="search" aria-label="Search songs" className="relative flex items-center">
      {/* Left icon */}
      <span className="pointer-events-none absolute left-2.5 flex items-center text-muted-foreground">
        {isFetching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </span>

      <Input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        aria-busy={isFetching}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "pl-8 transition-all duration-200",
          value ? "pr-7" : "pr-3",
          "w-44 focus:w-60"
        )}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
