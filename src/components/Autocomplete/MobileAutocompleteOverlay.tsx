import { SuggestionsList } from '@/components/Autocomplete/SuggestionsList';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { XButton } from '@/components/XButton';
import { useAutocompleteContext } from '@/providers/AutocompleteContext/autocompleteContext';
import { useRef } from 'react';

export const MobileAutocompleteOverlay = () => {
  const {
    query,
    setQuery,
    onInputChange,
    placeholder,
    isFocused,
    setIsFocused,
  } = useAutocompleteContext();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Drawer
      repositionInputs={false}
      open={isFocused}
      onOpenChange={setIsFocused}
    >
      <DrawerContent
        onAnimationEnd={() => {
          inputRef.current?.focus();
        }}
        className="min-h-[70vh] max-w-xl mx-auto"
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Suggestions List</DrawerTitle>
          <DrawerDescription>Autocomplete Suggestions List</DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center gap-2 mb-4 pt-4 px-4">
          <div className="relative w-full">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onInputChange?.(e.target.value);
              }}
              placeholder={placeholder}
              className="pr-10"
            />
            <XButton
              onClick={() => {
                setQuery('');
                onInputChange?.('');

                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              className="absolute top-0 right-0 z-50"
            />
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

        <SuggestionsList className="max-h-[calc(100vh-104px)] [&_li]:border-b [&_li]:border-black/10 [&_li]:last:border-none" />
      </DrawerContent>
    </Drawer>
  );
};
