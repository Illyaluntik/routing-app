import { createPortal } from 'react-dom';
import { SuggestionsList } from '@/components/Autocomplete/SuggestionsList';
import { useAutocompleteContext } from '@/providers/AutocompleteContext/autocompleteContext';
import { useDesktopOverlay } from '@/hooks/autocomplete/useDesktopOverlay';

export const DesktopAutocompleteOverlay = () => {
  const { inputRef, isFocused, suggestions } = useAutocompleteContext();

  const { top, left, width } = useDesktopOverlay(isFocused, inputRef);

  if (suggestions.length === 0 || !isFocused) {
    return null;
  }

  return createPortal(
    <div
      className="absolute z-[100] w-full shadow-md"
      style={{ top, left, width }}
    >
      <SuggestionsList />
    </div>,
    document.body
  );
};
