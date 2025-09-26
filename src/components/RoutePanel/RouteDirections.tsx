import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { ChevronDown } from 'lucide-react';
import { DirectionsList } from '@/components/RoutePanel/DirectionsList';
import { useRouteContext } from '@/providers/RouteContext/routeContext';

export const RouteDirections = () => {
  const { routeResult } = useRouteContext();
  const { directionsListExpanded, setDirectionsListExpanded } =
    useAppUIContext();

  if (!routeResult) {
    return null;
  }

  return (
    <Collapsible
      className="flex flex-col overflow-hidden"
      open={directionsListExpanded}
      onOpenChange={(open) => setDirectionsListExpanded(open)}
    >
      <CollapsibleTrigger className="w-full cursor-pointer text-lg font-bold text-left my-2.5 flex items-center justify-between">
        Directions
        <ChevronDown />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col overflow-hidden">
        <div className="overflow-auto scrollable-element">
          <DirectionsList />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
