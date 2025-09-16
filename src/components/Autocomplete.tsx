import { useRef, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { useUserPosition } from '@/providers/userPositionContext';
import { cn } from '@/lib/utils';

interface Suggestion {
  label: string;
  location: [number, number];
}

interface Props {
  placeholder?: string;
  onSelect: (location: [number, number], label: string) => void;
  onInputChange?: (value: string) => void;
  initialQuery?: string;
  className?: string;
  suggestionsListClassName?: string;
}

export const Autocomplete: React.FC<Props> = ({
  placeholder = 'Search',
  onSelect,
  onInputChange,
  initialQuery = '',
  className,
  suggestionsListClassName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [, setLoading] = useState(false);
  const { position } = useUserPosition();

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
        if (
          highlightedIndex !== null &&
          highlightedIndex >= 0 &&
          highlightedIndex < suggestions.length
        ) {
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

    try {
      const geocodeResp = await axios.get(
        'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
        {
          params: {
            f: 'json',
            magicKey: s.location,
          },
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
    setIsFocused(false);
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
        onBlur={() => {
          setTimeout(handleBlur, 200);
        }}
        className={cn('bg-white', className)}
      />
      {suggestions.length > 0 && isFocused && (
        <div
          className={cn(
            'absolute z-50 w-full',
            suggestionsListClassName
          )}
        >
          <ScrollArea className="w-full bg-white text-black shadow-md rounded-md mt-1">
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
