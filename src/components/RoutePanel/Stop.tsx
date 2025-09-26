import { Autocomplete } from '@/components/Autocomplete/Autocomplete';
import { XButton } from '@/components/XButton';
import { RouteStop } from '@/hooks/useRoute';
import { cn } from '@/lib/utils';
import { findAddressCandidates } from '@/misc/findAddressCandidates';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleDot, EllipsisVertical, Flag, Grip } from 'lucide-react';

interface Props {
  stop: RouteStop;
  index: number;
  className?: string;
}
export const Stop: React.FC<Props> = ({ stop, index, className }) => {
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
      className={cn('relative flex items-center gap-1 group', className)}
    >
      <Grip
        {...listeners}
        {...attributes}
        className={cn(
          'size-5 cursor-grab text-stone-500 touch-none outline-none order-1 lg:order-none',
          'group-hover:block sm:hidden',
          'block sm:group-hover:block'
        )}
      />
      {index < stops.length - 1 && (
        <CircleDot className="size-5 lg:group-hover:hidden" />
      )}
      {index === stops.length - 1 && (
        <Flag className="size-5 lg:group-hover:hidden" />
      )}
      <EllipsisVertical className="absolute left-1 top-full size-2.5 ellipsis-icon transition-opacity" />
      <div className="relative w-full">
        <Autocomplete
          onSelect={(s) => {
            findAddressCandidates(s).then((result) => {
              if (!result) {
                return;
              }

              updateStop(stop.id, result.coords, result.label);
            });
          }}
          onInputChange={(value) => {
            updateStop(stop.id, null, value);
          }}
          placeholder="Type or select a location"
          initialQuery={stop.label}
          className="shadow-sm pr-10"
        />
        {stops.length > 2 && (
          <XButton
            onClick={() => removeStop(stop.id)}
            className="absolute top-0 right-0"
          />
        )}
      </div>
    </div>
  );
};
