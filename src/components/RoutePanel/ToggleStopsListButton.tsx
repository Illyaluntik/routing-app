import { Button } from '@/components/ui/button';
import { MAX_DISPLAY_LENGTH } from '@/constants';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';

export const ToggleStopsListButton = () => {
  const { stopsListExpanded, setStopsListExpanded } = useAppUIContext();
  const { stops } = useRouteContext();

  if (stops.length <= MAX_DISPLAY_LENGTH) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className="cursor-pointer text-xs h-min p-0 !bg-transparent hover:text-stone-500 mt-2.5"
      onClick={() => setStopsListExpanded(!stopsListExpanded)}
    >
      {!stopsListExpanded && (
        <>
          {stops.length - MAX_DISPLAY_LENGTH} More Stops
          <ChevronsUpDown className="size-3" />
        </>
      )}
      {stopsListExpanded && (
        <>
          Collapse Stops
          <ChevronsDownUp className="size-3" />
        </>
      )}
    </Button>
  );
};
