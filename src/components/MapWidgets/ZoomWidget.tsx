import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cn from 'classnames';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';

interface Props {
  className?: string;
}
export const ZoomWidget: React.FC<Props> = ({ className }) => {
  const { view } = useMapViewContext();

  if (!view) {
    return null;
  }

  return (
    <div className={cn('bg-white/70 rounded-md shadow-md', className)}>
      <div className="flex flex-col backdrop-blur-sm rounded-md">
        <Button
          variant="ghost"
          className="cursor-pointer size-10"
          onClick={() => {
            view.goTo({ zoom: view.zoom + 1 });
          }}
        >
          <Plus />
        </Button>
        <div className="border-b border-black/10 w-[80%] ml-[10%]" />
        <Button
          variant="ghost"
          className="cursor-pointer size-10"
          onClick={() => {
            view.goTo({ zoom: view.zoom - 1 });
          }}
        >
          <Minus />
        </Button>
      </div>
    </div>
  );
};
