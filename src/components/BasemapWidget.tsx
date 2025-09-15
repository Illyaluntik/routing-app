import { useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMapView } from '@/providers/mapViewContext';
import { BASEMAPS, DEFAULT_BASEMAP } from '@/config/basemaps';

export interface Props {
  className?: string;
}

export const BasemapWidget: React.FC<Props> = ({ className }) => {
  const view = useMapView();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(DEFAULT_BASEMAP.id);
  const timeoutRef = useRef<number | null>(null);

  const switchBasemap = (id: string) => {
    if (!view?.map) {
      return;
    }
    view.map.basemap = id;
    setActive(id);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div
      className={cn('bg-white/70 rounded-md shadow-md', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col backdrop-blur-sm rounded-md relative">
        <Button
          variant="ghost"
          className={cn('cursor-pointer w-10 h-10', isOpen && 'bg-accent')}
        >
          <Layers />
        </Button>
        <div
          className={cn(
            'absolute top-0 left-full ml-2 bg-white shadow-lg rounded-md flex gap-2 p-2 z-50 transition-all ease-out',
            isOpen
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-2 pointer-events-none'
          )}
        >
          {BASEMAPS.map((bm) => (
            <button
              key={bm.id}
              onClick={() => switchBasemap(bm.id)}
              className={cn(
                'flex flex-col items-center w-20 cursor-pointer border rounded-md overflow-hidden hover:shadow-md transition',
                active === bm.id && 'ring-2 ring-blue-500'
              )}
            >
              <img
                src={bm.thumbnail}
                alt={bm.label}
                className="w-full h-12 object-cover"
              />
              <span className="text-xs py-1">{bm.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
