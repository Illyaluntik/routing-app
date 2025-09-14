import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleDot, EllipsisVertical, Flag, Grip, X } from 'lucide-react';
import { Autocomplete } from './Autocomplete';
import { Button } from './ui/button';
import { useContext } from 'react';
import { StopsContext } from '@/misc/stopsContext';
import { RouteStop } from '@/hooks/useRoute';

interface SortableItemProps {
  stop: RouteStop;
  index: number;
}

const SortableItem: React.FC<SortableItemProps> = ({ stop, index }) => {
  const { stops, updateStop, removeStop } = useContext(StopsContext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative flex items-center gap-1 mb-2.5 group">
        {index < stops.length - 1 && (
          <CircleDot className="size-5 group-hover:hidden" />
        )}
        {index === stops.length - 1 && (
          <Flag className="size-5 group-hover:hidden" />
        )}
        <Grip
          {...listeners}
          {...attributes}
          className="size-5 cursor-grab text-gray-400 hidden group-hover:block"
        />
        {index < stops.length - 1 && (
          <EllipsisVertical className="absolute left-1 top-full size-2.5" />
        )}
        <Autocomplete
          onSelect={(location, label) => {
            updateStop(stop.id, location, label);
          }}
          onInputChange={(value) => {
            updateStop(stop.id, null, value);
          }}
          placeholder="Type or select a location"
          initialQuery={stop.label}
          className="bg-black/10 placeholder:text-gray-300"
        />
        {stops.length > 2 && index !== 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => removeStop(stop.id)}
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SortableItem;
