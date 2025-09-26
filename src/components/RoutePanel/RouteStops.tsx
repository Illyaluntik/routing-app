import { ScrollArea } from '@/components/ui/scroll-area';
import { MAX_DISPLAY_LENGTH } from '@/constants';
import { cn } from '@/lib/utils';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
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
import { useState } from 'react';
import { AddStopButton } from './AddStopButton';
import { StopsList } from './StopsList';
import { ToggleStopsListButton } from './ToggleStopsListButton';

export const RouteStops = () => {
  const { stops, setStops } = useRouteContext();
  const sensors = useSensors(useSensor(PointerSensor));
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStops((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
    >
      <SortableContext items={stops} strategy={verticalListSortingStrategy}>
        <ScrollArea
          className={cn(
            'overflow-y-auto overflow-x-hidden scrollable-element max-h-[calc(100vh-238px-40px)]',
            isDragging && '[&_.ellipsis-icon]:opacity-0'
          )}
          style={{
            minHeight: `${
              36 * Math.min(stops.length, MAX_DISPLAY_LENGTH) +
              (Math.min(stops.length, MAX_DISPLAY_LENGTH) - 1) * 10 +
              6
            }px`,
          }}
        >
          <div className="flex flex-col gap-2.5 p-[3px] pl-0 overflow-hidden">
            <StopsList />
          </div>
        </ScrollArea>
        <ToggleStopsListButton />
        <AddStopButton />
      </SortableContext>
    </DndContext>
  );
};
