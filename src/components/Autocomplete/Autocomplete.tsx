import { DesktopAutocompleteOverlay } from '@/components/Autocomplete/DesktopAutocompleteOverlay';
import { MobileAutocompleteOverlay } from '@/components/Autocomplete/MobileAutocompleteOverlay';
import { Input } from '@/components/ui/input';
import {
  AutocompleteSuggestion,
  useAutocomplete,
} from '@/hooks/autocomplete/useAutocomplete';
import { useKeyboardNavigation } from '@/hooks/autocomplete/useKeyboardNavigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { AutocompleteContext } from '@/providers/autocompleteContext';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  placeholder?: string;
  onSelect: (s: AutocompleteSuggestion) => void;
  onInputChange?: (value: string) => void;
  initialQuery?: string;
  className?: string;
}

export const Autocomplete: React.FC<Props> = ({
  placeholder = 'Search',
  onSelect,
  onInputChange,
  initialQuery = '',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const { suggestions } = useAutocomplete(query);
  const isMobile = useIsMobile();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSelect = useCallback(
    async (s: AutocompleteSuggestion) => {
      onSelect(s);
      setQuery(s.label);
      setIsFocused(false);
    },
    [onSelect]
  );

  const { highlightedIndex, setHighlightedIndex } = useKeyboardNavigation(
    suggestions,
    handleSelect
  );

  const autocompleteContextValue = {
    inputRef,
    query,
    setQuery,
    onInputChange,
    placeholder,
    isFocused,
    setIsFocused,
    suggestions,
    highlightedIndex,
    setHighlightedIndex,
    handleSelect,
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onInputChange?.(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          if (!isMobile) {
            setTimeout(() => setIsFocused(false), 200);
          }
        }}
        className={cn('bg-white', className)}
      />

      <AutocompleteContext.Provider value={autocompleteContextValue}>
        {isMobile ? (
          <MobileAutocompleteOverlay />
        ) : (
          <DesktopAutocompleteOverlay />
        )}
      </AutocompleteContext.Provider>
    </div>
  );
};
