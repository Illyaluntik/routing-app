import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { useUserPosition } from '@/providers/userPositionContext';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Suggestion {
  label: string;
  location: [number, number] | string;
}

interface Props {
  placeholder?: string;
  onSelect: (location: [number, number], label: string) => void;
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
  const suggestionsListRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [, setLoading] = useState(false);
  const { position } = useUserPosition();
  const isMobile = useIsMobile();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSuggestions([]);
        setIsFocused(false);
        inputRef.current?.blur();
        setHighlightedIndex(null);
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
          handleSelect(suggestions[highlightedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [suggestions, highlightedIndex]);

  const handleChange = async (value: string) => {
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest',
        {
          params: {
            f: 'json',
            text: value,
            maxSuggestions: 5,
            location: position
              ? `${position.longitude},${position.latitude}`
              : undefined,
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const suggestionsData = response.data.suggestions.map((s: any) => ({
        label: s.text,
        location: s.magicKey,
      }));

      setSuggestions(suggestionsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (s: Suggestion) => {
    setQuery(s.label);
    setSuggestions([]);
    setIsFocused(false);

    try {
      const geocodeResp = await axios.get(
        'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
        {
          params: { f: 'json', magicKey: s.location },
        }
      );

      if (geocodeResp.data.candidates.length > 0) {
        const candidate = geocodeResp.data.candidates[0];
        const coords: [number, number] = [
          candidate.location.x,
          candidate.location.y,
        ];
        onSelect(coords, s.label);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    handleChange(query);
  };

  const handleBlur = () => {
    if (!isMobile) {
      setTimeout(() => setIsFocused(false), 200);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          handleChange(e.target.value);
          onInputChange?.(e.target.value);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn('bg-white', className)}
      />

      {/* Mobile overlay */}
      {isMobile &&
        isFocused &&
        createPortal(
          <div className="fixed top-5 bottom-0 inset-x-0 rounded-t-xl z-[100] bg-white p-4 overflow-auto shadow-lg shadow-black">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-full">
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    handleChange(e.target.value);
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
                    handleChange('');
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
            <ScrollArea className="max-h-[calc(100vh-104px)]">
              <ul>
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className={cn(
                      'p-2 hover:bg-gray-100 cursor-pointer border-b border-black/10 last:border-none',
                      highlightedIndex === i ? 'bg-gray-100' : ''
                    )}
                    onClick={() => handleSelect(s)}
                    onMouseOver={() => setHighlightedIndex(null)}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>,
          document.body
        )}

      {/* Desktop dropdown */}
      {!isMobile && suggestions.length > 0 && isFocused && (
        <div
          ref={suggestionsListRef}
          className="absolute z-50 w-full shadow-md top-full"
        >
          <ScrollArea className="w-full bg-white text-black rounded-md mt-1">
            <ul>
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className={cn(
                    'p-2 hover:bg-gray-100 cursor-pointer',
                    highlightedIndex === i ? 'bg-gray-100' : ''
                  )}
                  onClick={() => handleSelect(s)}
                  onMouseOver={() => setHighlightedIndex(null)}
                >
                  {s.label}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
