import { Stop } from '@/components/RoutePanel/Stop';
import { MAX_DISPLAY_LENGTH } from '@/constants';
import { cn } from '@/lib/utils';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';

export const StopsList = () => {
  const { stops } = useRouteContext();
  const { stopsListExpanded } = useAppUIContext();

  return (
    <>
      {stops
        .slice(0, stopsListExpanded ? stops.length : MAX_DISPLAY_LENGTH)
        .map((stop, index) => (
          <Stop
            key={stop.id}
            stop={stop}
            index={index}
            className={cn(
              ((stopsListExpanded && index === stops.length - 1) ||
                (!stopsListExpanded &&
                  index ===
                    Math.min(MAX_DISPLAY_LENGTH - 1, stops.length - 1))) &&
                '[&_.ellipsis-icon]:hidden'
            )}
          />
        ))}
    </>
  );
};
