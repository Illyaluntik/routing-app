import { AutocompleteSuggestion } from '@/hooks/autocomplete/useAutocomplete';
import { createContext, useContext } from 'react';

export interface AutocompleteContextValue {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onInputChange?: (v: string) => void;
  placeholder?: string;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  suggestions: AutocompleteSuggestion[];
  highlightedIndex: number | null;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleSelect: (s: AutocompleteSuggestion) => void;
}

export const AutocompleteContext = createContext<AutocompleteContextValue>(
  undefined as unknown as AutocompleteContextValue
);

export const useAutocompleteContext = () => useContext(AutocompleteContext);
