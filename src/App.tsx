import { useEffect, useMemo } from 'react';
import { Autocomplete } from './components/Autocomplete';
import { Button } from './components/ui/button';
import { MAX_STOPS, useRoute } from '@/hooks/useRoute';
import { ManeuverIcon } from './components/ManeuverIcon';
import StopsList from './components/StopsList';
import { StopsContext } from './misc/stopsContext';
import { Car, TriangleAlert, Truck, X } from 'lucide-react';
import cn from 'classnames';
import ReactDOM from 'react-dom/client';
import Point from '@arcgis/core/geometry/Point';
import { useMap } from './hooks/useMap';
import { useSelectedDirection } from './hooks/useSelectedDirection';
import { useStopMarkers } from './hooks/useStopMarkers';
import { Logo } from './components/icons/Logo';
import { MapPopup } from './components/MapPopup';
import { createPointGraphic } from './misc/createPointGraphic';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { WalkingPerson } from './components/icons/WalkingPerson';
import TravelMode from '@arcgis/core/rest/support/TravelMode';

import * as locator from '@arcgis/core/rest/locator.js';

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
  const { selectedDirectionIndex, onSelectDirection } = useSelectedDirection(
    view,
    routeResult
  );
  useStopMarkers(stops, view, stopsLayer);

  const searchLocation = (coords: [number, number], label: string) => {
    if (!view) {
      return;
    }

    view.goTo({
      target: createPointGraphic(coords),
      zoom: 14,
    });

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
      location: new Point({
        longitude: coords[0],
        latitude: coords[1],
      }),
      content: container,
    });
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

  const stopsContextValue = useMemo(
    () => ({
      stops: stops,
      setStops: setStops,
      updateStop: updateStop,
      removeStop: removeStop,
    }),
    [stops, setStops, updateStop, removeStop]
  );

  return (
    <div className="h-screen w-screen relative">
      <div ref={mapDiv} className="h-full w-full" />

      <div
        className={cn(
          'fixed top-5 left-5 right-5 z-60 flex flex-col gap-2.5 bg-black/70 text-white rounded-md shadow-md',
          stops.length > 0 ? 'w-[calc(100%-450px)]' : 'w-[calc(100%-40px)]'
        )}
      >
        <div className="backdrop-blur-sm p-2.5 !rounded-md h-[60px] flex items-center gap-2.5">
          <Logo />
          <div className="w-full max-w-[350px]">
            <Autocomplete
              onSelect={searchLocation}
              placeholder="Search or Click on Map"
              className="bg-black/10 placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* <div className="fixed top-[90px] left-5 z-50 flex flex-col gap-2.5 w-[410px]">
        <div className="bg-black/50 text-white rounded-md shadow-md z-40">
          <div className="backdrop-blur-sm p-2.5 !rounded-md">
            Recent Searches
          </div>
        </div>
      </div> */}

      <div className="fixed top-[20px] right-5 z-50 flex flex-col gap-2.5 w-[400px]">
        {stops.length > 0 && (
          <div className="bg-black/50 text-white rounded-md shadow-md z-[60]">
            <div className="backdrop-blur-sm p-2.5 !rounded-md relative">
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
                <TabsList className="text-white">
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
              <StopsContext.Provider value={stopsContextValue}>
                <StopsList />
              </StopsContext.Provider>

              {!hasUnfilledStops && stops.length < MAX_STOPS && (
                <Button
                  variant="secondary"
                  className="w-full mt-2.5"
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
            </div>
          </div>
        )}

        {routeResult && (
          <div className="bg-black/50 text-white rounded-md shadow-md overflow-hidden">
            <div className="backdrop-blur-sm p-2.5">
              <div className="text-lg font-bold mb-2.5">Route Summary</div>
              <div className="font-bold">
                Distance:{' '}
                <span className="font-normal">
                  {routeResult.summary.totalLength.toFixed(2)} mi
                </span>
              </div>
              <div className="font-bold">
                Duration:{' '}
                <span className="font-normal">
                  {routeResult.summary.totalTimeFormatted}
                </span>
              </div>
            </div>
          </div>
        )}

        {routeResult && (
          <div className="bg-black/50 text-white rounded-md shadow-md overflow-hidden">
            <div className="backdrop-blur-sm py-2.5">
              <div className="text-lg font-bold mb-2.5 px-2.5">Directions</div>
              <div className="max-h-[500px] overflow-y-auto">
                {routeResult.directions.map((dir, index) => (
                  <div
                    key={index}
                    className={cn(
                      'mb-2.5 flex justify-between items-center gap-2 cursor-pointer hover:bg-white/20 px-2.5 py-1',
                      selectedDirectionIndex === index
                        ? 'bg-white/20'
                        : 'bg-transparent'
                    )}
                    onClick={() => onSelectDirection(index, dir)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{dir.attributes.text}</span>
                      {dir.attributes.length !== 0 &&
                        dir.attributes.time !== 0 && (
                          <span className="text-xs">
                            {(dir.attributes.length * 0.62137).toFixed(2)} mi -{' '}
                            {dir.attributes.time < 1
                              ? `${(dir.attributes.time * 60).toFixed(0)} sec`
                              : `${dir.attributes.time.toFixed(0)} min`}
                          </span>
                        )}
                    </div>
                    <ManeuverIcon type={dir.attributes.maneuverType} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
