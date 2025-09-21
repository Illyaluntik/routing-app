import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { SuggestionsList } from '@/components/Autocomplete/SuggestionsList';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAutocompleteContext } from '@/providers/AutocompleteContext/autocompleteContext';

export const MobileAutocompleteOverlay = () => {
  const {
    query,
    setQuery,
    onInputChange,
    placeholder,
    isFocused,
    setIsFocused,
  } = useAutocompleteContext();

  if (!isFocused) {
    return null;
  }

  return createPortal(
    <div className="fixed top-5 bottom-0 inset-x-0 rounded-t-xl z-[100] bg-white p-4 overflow-auto shadow-lg shadow-black">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full">
          <Input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onInputChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className="pr-10"
          />
          <Button
            className="absolute top-0 right-0 cursor-pointer z-50"
            size="icon"
            variant="ghost"
            onClick={() => {
              setQuery('');
            }}
          >
            <X />
          </Button>
        </div>
        <button
          className="text-sm"
          onClick={() => {
            setIsFocused(false);
          }}
        >
          Close
        </button>
      </div>

      <SuggestionsList className="max-h-[calc(100vh-104px)] [&_li]:border-b [&_li]:border-black/10 [&_li]:last:border-none " />
    </div>,
    document.body
  );
};
