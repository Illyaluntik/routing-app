import { Autocomplete } from '@/components/Autocomplete';
import { BasemapWidget } from '@/components/BasemapWidget';
import { WalkingPerson } from '@/components/icons/WalkingPerson';
import { LocateWidget } from '@/components/LocateWidget';
import { ManeuverIcon } from '@/components/ManeuverIcon';
import { MapPopup } from '@/components/MapPopup';
import { MaximizeRouteWidget } from '@/components/MaximizeRouteWidget';
import StopsList from '@/components/StopsList';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ZoomWidget } from '@/components/ZoomWidget';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMap } from '@/hooks/useMap';
import { MAX_STOPS, useRoute } from '@/hooks/useRoute';
import { useRouteDirection } from '@/hooks/useRouteDirection';
import { useStopMarkers } from '@/hooks/useStopMarkers';
import { createPointGraphic } from '@/misc/createPointGraphic';
import { MapViewContext } from '@/providers/mapViewContext';
import { RouteContext } from '@/providers/routeContext';
import {
  UserPositionContext,
  UserPositionContextValue,
} from '@/providers/userPositionContext';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import Point from '@arcgis/core/geometry/Point';
import * as locator from '@arcgis/core/rest/locator.js';
import TravelMode from '@arcgis/core/rest/support/TravelMode';
import MapView from '@arcgis/core/views/MapView';
import cn from 'classnames';
import {
  Car,
  ChevronDown,
  Minimize2,
  TriangleAlert,
  Truck,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const { mapDiv, view, routeLayer, stopsLayer } = useMap();
  const {
    stops,
    setStops,
    addStop,
    updateStop,
    removeStop,
    addStopFromMap,
    hasUnfilledStops,
    routeResult,
    createInitialRoute,
    resetRoute,
    travelMode,
    setTravelMode,
    error,
  } = useRoute(view, routeLayer, stopsLayer);
  const { selectedDirectionIndex, onSelectDirection } = useRouteDirection(
    view,
    routeResult
  );
  const { position, setPosition, requestLocation } = useGeolocation(view);
  useStopMarkers(stops, view, stopsLayer);
  const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
  // TODO: rework with listener
  const isMobile = useMemo(() => window.innerWidth <= 1024, []);
  const [routeMinimized, setRouteMinimized] = useState(false);

  const searchLocation = (coords: [number, number], label: string) => {
    if (!view) {
      return;
    }

    view.goTo(
      {
        target: createPointGraphic(coords),
        zoom: 20,
      },
      {
        duration: 2500,
      }
    );

    const container = document.createElement('div');
    ReactDOM.createRoot(container).render(
      <MapPopup
        view={view}
        createInitialRoute={createInitialRoute}
        addStop={addStopFromMap}
        coords={coords}
        label={label}
        showDirectionsButtons={stops.length === 0}
      />
    );

    // setIsMapPopupOpen(true);
    view.openPopup({
      location: new Point({
        longitude: coords[0],
        latitude: coords[1],
      }),
      content: container,
    });
  };

  const minimizeRoute = () => {
    setRouteMinimized(true);
  };

  useEffect(() => {
    if (!view) {
      return;
    }

    const handler = view.on('click', async (event) => {
      const { mapPoint } = event;
      if (!mapPoint?.latitude || !mapPoint?.longitude) {
        return;
      }

      const coords: [number, number] = [mapPoint.longitude, mapPoint.latitude];

      try {
        const result = await locator.locationToAddress(
          import.meta.env.VITE_ARCGIS_LOCATION_TO_ADDRESS_SERVICE_URL,
          {
            location: mapPoint,
          }
        );

        const label =
          result.address || `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`;

        const container = document.createElement('div');
        ReactDOM.createRoot(container).render(
          <MapPopup
            view={view}
            createInitialRoute={createInitialRoute}
            addStop={addStopFromMap}
            coords={coords}
            label={label}
            showDirectionsButtons={stops.length === 0}
          />
        );

        view.openPopup({
          location: mapPoint,
          content: container,
        });
      } catch (err) {
        console.error('Reverse geocode failed', err);
      }
    });

    return () => handler.remove();
  }, [view, stops, createInitialRoute, addStopFromMap]);

  useEffect(() => {
    if (!view || !isMobile) {
      return;
    }

    reactiveUtils.watch(
      () => view?.popup?.visible,
      (visible) => {
        setIsMapPopupOpen(visible ?? false);
      }
    );
  }, [view, isMobile]);

  const routeContextValue = useMemo(
    () => ({
      stops: stops,
      setStops: setStops,
      updateStop: updateStop,
      removeStop: removeStop,
    }),
    [stops, setStops, updateStop, removeStop]
  );

  const userPositionContextValue = useMemo(
    () => ({
      position,
      setPosition,
      requestLocation,
    }),
    [position, setPosition, requestLocation]
  );

  return (
    <MapViewContext.Provider value={view as MapView}>
      <UserPositionContext.Provider
        value={userPositionContextValue as UserPositionContextValue}
      >
        <div className="h-[100dvh] w-screen relative">
          <div ref={mapDiv} className="h-full w-full" />
          <div className="absolute top-[90px] lg:top-auto lg:bottom-5 left-5 z-50 flex flex-col gap-1">
            <BasemapWidget />
            <LocateWidget />
            <ZoomWidget />
          </div>

          <div className="absolute top-5 left-5 z-60 flex flex-col gap-2.5 bg-white/70 rounded-md shadow-md w-full max-w-[calc(100vw-40px)] sm:max-w-[400px]">
            <div className="backdrop-blur-sm p-2.5 !rounded-md h-[60px] flex items-center gap-2.5">
              <img
                src="logo.svg"
                className="h-full w-auto rounded-sm shadow-sm"
              />
              <div className="w-full max-w-[350px]">
                <Autocomplete
                  onSelect={searchLocation}
                  placeholder="Search or Click on Map"
                  className="shadow-sm"
                />
              </div>
            </div>
          </div>

          {((isMobile && !isMapPopupOpen) || !isMobile) && routeMinimized && (
            <MaximizeRouteWidget
              setRouteMinimized={setRouteMinimized}
              className="absolute bottom-5 right-5 z-50"
            />
          )}

          {((isMobile && !isMapPopupOpen) || !isMobile) && !routeMinimized && (
            <div className="absolute bottom-5 lg:bottom-auto lg:top-5 left-5 lg:left-auto lg:right-5 z-50 flex flex-col gap-2.5 w-full max-w-[calc(100vw-40px)] sm:max-w-[400px]">
              {stops.length > 0 && (
                <div className="bg-white/70 rounded-md shadow-md">
                  <div className="backdrop-blur-sm p-2.5 !rounded-md relative max-h-[calc(100dvh-106px)] lg:max-h-[calc(100vh-40px)] h-full flex flex-col">
                    {isMobile && (
                      <Button
                        className="absolute top-0 right-9 cursor-pointer z-50"
                        size="icon"
                        variant="ghost"
                        onClick={minimizeRoute}
                      >
                        <Minimize2 />
                      </Button>
                    )}
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
                    <RouteContext.Provider value={routeContextValue}>
                      <StopsList />
                    </RouteContext.Provider>

                    {!hasUnfilledStops && stops.length < MAX_STOPS && (
                      <Button
                        variant="outline"
                        className="w-full mt-2.5 cursor-pointer"
                        onClick={addStop}
                      >
                        Add Stop
                      </Button>
                    )}

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
                            {routeResult.summary.totalLength.toFixed(2)} mi
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
                                          {(
                                            dir.attributes.length * 0.62137
                                          ).toFixed(2)}{' '}
                                          mi -{' '}
                                          {dir.attributes.time < 1
                                            ? `${(
                                                dir.attributes.time * 60
                                              ).toFixed(0)} sec`
                                            : `${dir.attributes.time.toFixed(
                                                0
                                              )} min`}
                                        </span>
                                      )}
                                  </div>
                                  <ManeuverIcon
                                    type={dir.attributes.maneuverType}
                                  />
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
          )}
        </div>
      </UserPositionContext.Provider>
    </MapViewContext.Provider>
  );
}

export default App;
