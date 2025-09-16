import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cn from 'classnames';
import { useEffect } from 'react';
import { useMapView } from '@/providers/mapViewContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import Point from '@arcgis/core/geometry/Point';
import { UserPosition } from '@/providers/userPositionContext';

interface Props {
  className?: string;
}
export const LocateWidget: React.FC<Props> = ({ className }) => {
  const view = useMapView();
  const { position, requestLocation } = useGeolocation(view);

  const zoomToUserPosition = (
    location: UserPosition,
    animationDuration = 2500
  ) => {
    view.goTo(
      {
        target: new Point({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
        zoom: 18,
      },
      {
        duration: animationDuration,
      }
    );
  };

  useEffect(() => {
    if (!position || !view) {
      return;
    }

    view.when(() => {
      zoomToUserPosition(position, 0);
    });
  }, [position, view]);

  return (
    <div className={cn('bg-white/70 rounded-md shadow-md', className)}>
      <div className="flex flex-col backdrop-blur-sm rounded-md">
        <Button
          variant="ghost"
          className="cursor-pointer size-10"
          onClick={() => {
            if (position) {
              zoomToUserPosition(position);
            } else {
              requestLocation();
            }
          }}
        >
          <Navigation />
        </Button>
      </div>
    </div>
  );
};
