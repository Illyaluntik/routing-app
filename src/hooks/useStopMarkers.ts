import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import { useEffect } from 'react';
import { RouteStop } from '@/hooks/useRoute';

/**
 * Hook that manages the display of stop markers on a map.
 *
 * @param stops
 * @param view
 * @param stopsLayer
 */
export const useStopMarkers = (
  stops: RouteStop[],
  view: MapView | null,
  stopsLayer: GraphicsLayer | null
) => {
  useEffect(() => {
    if (stopsLayer && view) {
      stopsLayer.graphics.removeAll();
      stops.forEach((stop) => {
        if (stop.graphic) {
          stopsLayer.graphics.add(stop.graphic);
        }
      });
    }
  }, [view, stopsLayer, stops]);
};
