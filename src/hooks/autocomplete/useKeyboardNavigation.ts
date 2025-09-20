import { AutocompleteSuggestion } from '@/hooks/autocomplete/useAutocomplete';
import { useEffect, useState } from 'react';

export const useKeyboardNavigation = (
  suggestions: AutocompleteSuggestion[],
  onSelect: (s: AutocompleteSuggestion) => void
) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHighlightedIndex(null);
        (document.activeElement as HTMLInputElement)?.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev === null) return 0;
          return prev < suggestions.length - 1 ? prev + 1 : 0;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev === null) return suggestions.length - 1;
          return prev > 0 ? prev - 1 : suggestions.length - 1;
        });
      } else if (e.key === 'Enter') {
        if (highlightedIndex !== null && suggestions[highlightedIndex]) {
          onSelect(suggestions[highlightedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [highlightedIndex, suggestions, onSelect]);

  return { highlightedIndex, setHighlightedIndex };
};
