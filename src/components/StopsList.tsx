import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '@/components/SortableItem';
import { useRouteContext } from '@/providers/routeContext';
import { Button } from '@/components/ui/button';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MAX_DISPLAY_LENGTH = 4;

const StopsList = () => {
  const { stops, setStops } = useRouteContext();
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStops((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  const [isListExpanded, setIsListExpanded] = useState(false);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={stops} strategy={verticalListSortingStrategy}>
        {stops
          .slice(0, isListExpanded ? stops.length : MAX_DISPLAY_LENGTH)
          .map((stop, index) => (
            <SortableItem
              key={stop.id}
              stop={stop}
              index={index}
              className={cn(
                ((isListExpanded && index === stops.length - 1) ||
                  (!isListExpanded &&
                    index ===
                      Math.min(MAX_DISPLAY_LENGTH - 1, stops.length - 1))) &&
                  '[&_.ellipsis-icon]:hidden'
              )}
            />
          ))}
        {stops.length > MAX_DISPLAY_LENGTH && (
          <Button
            variant="ghost"
            className="cursor-pointer text-xs h-min p-0 !bg-transparent hover:text-stone-500"
            onClick={() => setIsListExpanded(!isListExpanded)}
          >
            {!isListExpanded && (
              <>
                {stops.length - MAX_DISPLAY_LENGTH} More Stops
                <ChevronsUpDown className="size-3" />
              </>
            )}
            {isListExpanded && (
              <>
                Collapse Stops
                <ChevronsDownUp className="size-3" />
              </>
            )}
          </Button>
        )}
      </SortableContext>
    </DndContext>
  );
};

export default StopsList;
