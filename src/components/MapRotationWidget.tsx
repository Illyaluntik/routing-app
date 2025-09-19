import { Button } from '@/components/ui/button';
import cn from 'classnames';
import { useMapView } from '@/providers/mapViewContext';
import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

interface Props {
  className?: string;
}
export const MapRotationWidget: React.FC<Props> = ({ className }) => {
  const view = useMapView();
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
          className="cursor-pointer size-10"
          onClick={() => {
            view.goTo({
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
