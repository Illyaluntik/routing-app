import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAutocompleteContext } from '@/providers/autocompleteContext';

interface Props {
  className?: string;
}

export const SuggestionsList: React.FC<Props> = ({ className }) => {
  const { suggestions, highlightedIndex, handleSelect, setHighlightedIndex } =
    useAutocompleteContext();

  return (
    <ScrollArea className={cn('bg-white text-black rounded-md', className)}>
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
  );
};
