import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleDot, EllipsisVertical, Flag, Grip, X } from 'lucide-react';
import { Autocomplete } from '@/components/Autocomplete';
import { Button } from '@/components/ui/button';
import { useRouteContext } from '@/providers/routeContext';
import { RouteStop } from '@/hooks/useRoute';
import { cn } from '@/lib/utils';

interface Props {
  stop: RouteStop;
  index: number;
  className?: string;
}

const SortableItem: React.FC<Props> = ({ stop, index, className }) => {
  const { stops, updateStop, removeStop } = useRouteContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('relative flex items-center gap-1 mb-2.5 group', className)}
    >
      {index < stops.length - 1 && (
        <CircleDot className="size-5 group-hover:hidden" />
      )}
      {index === stops.length - 1 && (
        <Flag className="size-5 group-hover:hidden" />
      )}
      <Grip
        {...listeners}
        {...attributes}
        className="size-5 cursor-grab text-stone-500 hidden group-hover:block"
      />
      <EllipsisVertical className="absolute left-1 top-full size-2.5 ellipsis-icon" />
      <Autocomplete
        onSelect={(location, label) => {
          updateStop(stop.id, location, label);
        }}
        onInputChange={(value) => {
          updateStop(stop.id, null, value);
        }}
        placeholder="Type or select a location"
        initialQuery={stop.label}
        className="shadow-sm pr-10"
        suggestionsListClassName="bottom-10 lg:bottom-auto"
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
  );
};

export default SortableItem;
