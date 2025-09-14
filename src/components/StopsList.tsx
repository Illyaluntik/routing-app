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
import { StopsContext } from '@/misc/stopsContext';
import { useContext } from 'react';

const StopsList = () => {
  const { stops, setStops } = useContext(StopsContext);
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={stops} strategy={verticalListSortingStrategy}>
        {stops.map((stop, index) => (
          <SortableItem key={stop.id} stop={stop} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default StopsList;
