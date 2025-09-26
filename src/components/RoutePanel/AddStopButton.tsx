import { Button } from '@/components/ui/button';
import { MAX_DISPLAY_LENGTH, MAX_STOPS } from '@/constants';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';

export const AddStopButton = () => {
  const { stopsListExpanded, setStopsListExpanded } = useAppUIContext();
  const { hasUnfilledStops, stops, addStop } = useRouteContext();

  if (hasUnfilledStops || stops.length >= MAX_STOPS) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full mt-2.5 cursor-pointer"
      onClick={() => {
        if (stops.length + 1 > MAX_DISPLAY_LENGTH && !stopsListExpanded) {
          setStopsListExpanded(true);
        }
        addStop();
      }}
    >
      Add Stop
    </Button>
  );
};
