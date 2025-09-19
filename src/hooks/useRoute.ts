import { useTravelModes } from '@/hooks/useTravelModes';
import { createPointGraphic } from '@/misc/createPointGraphic';
import { createRouteGraphic } from '@/misc/createRouteGraphic';
import { createStopId } from '@/misc/createStopId';
import Graphic from '@arcgis/core/Graphic';
import EsriError from '@arcgis/core/core/Error.js';
import Geometry from '@arcgis/core/geometry/Geometry.js';
import Point from '@arcgis/core/geometry/Point';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import * as route from '@arcgis/core/rest/route';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import TravelMode from '@arcgis/core/rest/support/TravelMode';
import MapView from '@arcgis/core/views/MapView';
import { useEffect, useMemo, useState } from 'react';

export interface RouteResult {
  geometry: nullish | Geometry;
  summary: {
    totalLength: number;
    totalTime: number;
    totalTimeFormatted: string;
    totalLengthFormatted: string;
  };
  directions: Graphic[];
}

export interface RouteStop {
  id: string;
  coordinates?: [number, number] | null;
  label?: string;
  graphic?: Graphic;
}

export interface InitialRoutePoint {
  coords: [number, number];
  label: string;
}

export const MAX_STOPS = 20;

export const useRoute = (
  view: MapView | null,
  routeLayer: GraphicsLayer | null,
  stopsLayer: GraphicsLayer | null
) => {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedTravelMode, travelMode, setTravelMode } = useTravelModes();

  const createInitialRoute = (
    start?: InitialRoutePoint,
    end?: InitialRoutePoint
  ) => {
    if (!view) {
      return;
    }

    const initialStart: RouteStop = {
      id: createStopId(),
      coordinates: start?.coords,
      label: start?.label,
      graphic: createPointGraphic(start?.coords),
    };
    const initialEnd: RouteStop = {
      id: createStopId(),
      coordinates: end?.coords,
      label: end?.label,
      graphic: createPointGraphic(end?.coords),
    };

    setStops([initialStart, initialEnd]);

    view.goTo({
      target: initialStart.graphic ?? initialEnd.graphic,
      zoom: 14,
    });
  };

  const addStop = () => {
    if (hasUnfilledStops || stops.length >= MAX_STOPS) {
      return;
    }

    const id = createStopId();
    setStops((prev) => [...prev, { id }]);

    return id;
  };

  const updateStop = (
    id: string,
    coords: [number, number] | null,
    label: string
  ) => {
    setStops((prev) => {
      return prev.map((stop) => {
        if (stop.id === id) {
          const newGraphic = createPointGraphic(coords);

          return { ...stop, coordinates: coords, label, graphic: newGraphic };
        }
        return stop;
      });
    });
  };

  const removeStop = (id: string) => {
    setStops((prev) => {
      const stopToRemove = prev.find((stop) => stop.id === id);
      if (stopToRemove?.graphic && stopsLayer && view) {
        stopsLayer.remove(stopToRemove.graphic);
      }

      return prev.filter((stop) => stop.id !== id);
    });
  };

  const addStopFromMap = (coords: [number, number] | null, label: string) => {
    const id = hasUnfilledStops
      ? stops.find((s) => !s.coordinates || !s.label || !s.graphic)!.id
      : addStop()!;

    updateStop(id, coords, label);
  };

  const computeRoute = async (
    stops: RouteStop[],
    selectedTravelMode?: TravelMode
  ) => {
    const validStops = stops.filter((s) => s.coordinates);
    if (validStops.length < 2) {
      setError('At least two valid points are required');
      return;
    }

    if (
      stops.every(
        (s) =>
          stops[0].coordinates?.[0] === s.coordinates?.[0] &&
          stops[0].coordinates?.[1] === s.coordinates?.[1]
      )
    ) {
      setError(
        'All stops are at the same location. Please select different points.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stopGraphics = validStops.map(
        (s) =>
          new Graphic({
            geometry: new Point({
              longitude: s.coordinates![0],
              latitude: s.coordinates![1],
            }),
          })
      );

      const params = new RouteParameters({
        apiKey: import.meta.env.VITE_ARCGIS_API_KEY,
        stops: new FeatureSet({ features: stopGraphics }),
        returnDirections: true,
        directionsOutputType: 'complete',
        returnRoutes: true,
        returnStops: true,
        travelMode: selectedTravelMode,
        outSpatialReference: { wkid: 4326 },
      });

      const result = await route.solve(
        import.meta.env.VITE_ARCGIS_ROUTE_SERVICE_URL,
        params
      );

      if (result.routeResults.length > 0) {
        const r = result.routeResults[0];

        if (!r.route) {
          throw new Error('No route found');
        }

        const timeAttribute =
          r.route.attributes[
            `Total_${
              selectedTravelMode?.timeAttributeName
                ? selectedTravelMode.timeAttributeName
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('')
                : 'TravelTime'
            }`
          ];

        setRouteResult({
          geometry: r.route.geometry,
          summary: {
            totalLength: r.route.attributes.Total_Miles,
            totalTime: timeAttribute,
            totalTimeFormatted:
              timeAttribute > 60
                ? `${Math.floor(timeAttribute / 60)} hrs ${(
                    timeAttribute % 60
                  )?.toFixed(0)} mins`
                : `${timeAttribute?.toFixed(0)} mins`,
            totalLengthFormatted: `${r.route.attributes.Total_Miles.toFixed(
              2
            )} mi`,
          },
          directions: r.directions?.features.slice(1, -1) || [],
        });
      }
    } catch (err: unknown) {
      setError(
        (err as EsriError).details.messages.join('\n') || 'Routing failed'
      );
      setRouteResult(null);
      clearRouteLayer();
    } finally {
      setLoading(false);
    }
  };

  const resetRoute = () => {
    setStops([]);
    setRouteResult(null);
    clearStopsLayer();
    clearRouteLayer();
  };

  const clearStopsLayer = () => {
    if (stopsLayer) {
      stopsLayer.graphics.removeAll();
    }
  };

  const clearRouteLayer = () => {
    if (routeLayer) {
      routeLayer.graphics.removeAll();
    }
  };

  const hasUnfilledStops = useMemo(
    () =>
      stops.some((stop) => !stop.coordinates || !stop.label || !stop.graphic),
    [stops]
  );

  useEffect(() => {
    if (!hasUnfilledStops && stops.length > 0) {
      computeRoute(stops, selectedTravelMode);
    } else {
      setRouteResult(null);
      setError(null);
      if (routeLayer) {
        routeLayer.removeAll();
      }
    }
  }, [stops, selectedTravelMode, hasUnfilledStops, routeLayer]);

  useEffect(() => {
    const showRouteOnMap = (result: RouteResult) => {
      if (!view || !routeLayer) {
        return;
      }

      routeLayer.removeAll();
      const routeGraphic = createRouteGraphic(result.geometry);

      routeLayer.add(routeGraphic);
      view.goTo(routeGraphic);
    };

    if (routeResult) {
      showRouteOnMap(routeResult);
    }
  }, [view, routeLayer, routeResult]);

  return {
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
    loading,
    error,
    travelMode,
    setTravelMode,
  };
};
