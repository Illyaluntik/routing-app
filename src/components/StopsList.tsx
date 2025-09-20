import SortableItem from '@/components/SortableItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MAX_STOPS } from '@/hooks/useRoute';
import { cn } from '@/lib/utils';
import { useRouteContext } from '@/providers/routeContext';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const MAX_DISPLAY_LENGTH = 3;

const StopsList = () => {
  const { stops, setStops, hasUnfilledStops, addStop } = useRouteContext();
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
        <ScrollArea
          className={cn(
            'overflow-auto scrollable-element max-h-[calc(100vh-238px-40px)]',
            !isListExpanded && 'min-h-fit'
          )}
        >
          <div className="flex flex-col gap-2.5 p-[3px] pl-0">
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
                          Math.min(
                            MAX_DISPLAY_LENGTH - 1,
                            stops.length - 1
                          ))) &&
                      '[&_.ellipsis-icon]:hidden'
                  )}
                />
              ))}
          </div>
        </ScrollArea>
        {stops.length > MAX_DISPLAY_LENGTH && (
          <Button
            variant="ghost"
            className="cursor-pointer text-xs h-min p-0 !bg-transparent hover:text-stone-500 mt-2.5"
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
        {!hasUnfilledStops && stops.length < MAX_STOPS && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2.5 cursor-pointer"
            onClick={() => {
              if (stops.length + 1 > MAX_DISPLAY_LENGTH && !isListExpanded) {
                setIsListExpanded(true);
              }
              addStop();
            }}
          >
            Add Stop
          </Button>
        )}
      </SortableContext>
    </DndContext>
  );
};

export default StopsList;
