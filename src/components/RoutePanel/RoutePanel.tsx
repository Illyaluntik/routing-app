import { RouteDetailToggleWidget } from '@/components/MapWidgets/RouteDetailToggleWidget';
import { RouteStops } from '@/components/RoutePanel/RouteStops';
import { TravelModeSwitch } from '@/components/RoutePanel/TravelModeSwitch';
import { XButton } from '@/components/XButton';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { RouteDirections } from './RouteDirections';
import { RouteError } from './RouteError';
import { RouteSummary } from './RouteSummary';

export const RoutePanel = () => {
  const { mapPopupOpen, routeMinimized } = useAppUIContext();
  const { stops, resetRoute } = useRouteContext();
  const isMobile = useIsMobile(1024);

  if (stops.length === 0 || routeMinimized || (isMobile && mapPopupOpen)) {
    return null;
  }

  return (
    <div className="absolute bottom-5 lg:bottom-auto lg:top-5 left-5 lg:left-auto lg:right-5 z-40 flex flex-col gap-2.5 w-full max-w-[calc(100vw-40px)] sm:max-w-[400px]">
      <div className="bg-white/70 rounded-md shadow-md">
        <div className="backdrop-blur-sm p-2.5 !rounded-md relative max-h-[calc(100dvh-106px)] lg:max-h-[calc(100vh-40px)] h-full flex flex-col">
          <RouteDetailToggleWidget className="absolute top-0 right-9 cursor-pointer z-50" />
          <XButton
            onClick={resetRoute}
            className="absolute top-0 right-0 z-50 "
          />

          <TravelModeSwitch className="ml-6 mb-2.5" />
          <RouteStops />
          <RouteError />
          <RouteSummary />
          <RouteDirections />
        </div>
      </div>
    </div>
  );
};
