import { Button } from '@/components/ui/button';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';

interface Props {
  className?: string;
}
export const MapRotationWidget: React.FC<Props> = ({ className }) => {
  const { view } = useMapViewContext();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!view) {
      return;
    }

    reactiveUtils.watch(
      () => view.rotation,
      (rotation) => {
        setRotation(rotation);
      }
    );
  }, [view]);

  if (rotation === 0) {
    return null;
  }

  return (
    <div className={cn('bg-white/70 rounded-md shadow-md', className)}>
      <div className="backdrop-blur-sm rounded-md">
        <Button
          variant="ghost"
          className="cursor-pointer size-10 active:bg-accent"
          onClick={() => {
            view?.goTo({
              rotation: 0,
            });
          }}
        >
          <Compass />
        </Button>
      </div>
    </div>
  );
};
