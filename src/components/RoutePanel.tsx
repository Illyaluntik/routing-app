import { WalkingPerson } from '@/components/icons/WalkingPerson';
import { ManeuverIcon } from '@/components/ManeuverIcon';
import { RouteDetailToggleWidget } from '@/components/MapWidgets/RouteDetailToggleWidget';
import StopsList from '@/components/StopsList';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRouteDirection } from '@/hooks/useRouteDirection';
import { cn } from '@/lib/utils';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import TravelMode from '@arcgis/core/rest/support/TravelMode';
import { Car, ChevronDown, TriangleAlert, Truck, X } from 'lucide-react';

export const RoutePanel = () => {
  const { view } = useMapViewContext();
  const { mapPopupOpen, routeMinimized } = useAppUIContext();
  const { stops, routeResult, travelMode, setTravelMode, resetRoute, error } =
    useRouteContext();
  const { selectedDirectionIndex, onSelectDirection } = useRouteDirection(
    view,
    routeResult
  );
  const isMobile = useIsMobile(1024);

  if (routeMinimized || (isMobile && mapPopupOpen)) {
    return null;
  }

  return (
    <div className="absolute bottom-5 lg:bottom-auto lg:top-5 left-5 lg:left-auto lg:right-5 z-70 flex flex-col gap-2.5 w-full max-w-[calc(100vw-40px)] sm:max-w-[400px]">
      {stops.length > 0 && (
        <div className="bg-white/70 rounded-md shadow-md">
          <div className="backdrop-blur-sm p-2.5 !rounded-md relative max-h-[calc(100dvh-106px)] lg:max-h-[calc(100vh-40px)] h-full flex flex-col">
            <RouteDetailToggleWidget className="absolute top-0 right-9 cursor-pointer z-50" />
            <Button
              className="absolute top-0 right-0 cursor-pointer z-50"
              size="icon"
              variant="ghost"
              onClick={resetRoute}
            >
              <X />
            </Button>
            <Tabs
              defaultValue={travelMode}
              className="ml-6 mb-2.5"
              onValueChange={(value) =>
                setTravelMode(value as TravelMode['type'])
              }
            >
              <TabsList className="text-white shadow-sm">
                <TabsTrigger value="automobile">
                  <Car />
                </TabsTrigger>
                <TabsTrigger value="walk">
                  <WalkingPerson />
                </TabsTrigger>
                <TabsTrigger value="truck">
                  <Truck />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <StopsList />

            {error && (
              <div className="flex items-start gap-2.5 mt-5 text-gray-00">
                <TriangleAlert className="size-5 shrink-0 mt-1" />
                {error}
              </div>
            )}

            {routeResult && (
              <>
                <div className="flex items-baseline-last gap-2.5 mt-5">
                  <span className="font-bold text-3xl">
                    {routeResult.summary.totalTimeFormatted}
                  </span>
                  -
                  <span className="text-sm">
                    {routeResult.summary.totalLengthFormatted}
                  </span>
                </div>
                <Collapsible className="flex flex-col overflow-hidden">
                  <CollapsibleTrigger className="w-full cursor-pointer text-lg font-bold text-left my-2.5 flex items-center justify-between">
                    Directions
                    <ChevronDown />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col overflow-hidden">
                    <div className="overflow-auto scrollable-element">
                      {routeResult.directions.map((dir, index) => (
                        <div
                          key={index}
                          className={cn(
                            'mb-2.5 flex justify-between items-center gap-2 cursor-pointer hover:bg-stone-200 px-2.5 py-1 rounded-md',
                            selectedDirectionIndex === index
                              ? '!bg-stone-300'
                              : 'bg-transparent'
                          )}
                          onClick={() => onSelectDirection(index, dir)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {dir.attributes.text}
                            </span>
                            {dir.attributes.length !== 0 &&
                              dir.attributes.time !== 0 && (
                                <span className="text-xs">
                                  {(dir.attributes.length * 0.62137).toFixed(2)}{' '}
                                  mi -{' '}
                                  {dir.attributes.time < 1
                                    ? `${(dir.attributes.time * 60).toFixed(
                                        0
                                      )} sec`
                                    : `${dir.attributes.time.toFixed(0)} min`}
                                </span>
                              )}
                          </div>
                          <ManeuverIcon type={dir.attributes.maneuverType} />
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
