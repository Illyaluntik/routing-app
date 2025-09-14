import { useEffect, useState } from 'react';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import { RouteResult } from '@/hooks/useRoute';

/**
 * Hook to manage the selection of a direction steps in a route.
 *
 * @param view
 * @param routeResult
 */
export const useSelectedDirection = (
  view: MapView | null,
  routeResult: RouteResult | null
) => {
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<
    number | null
  >(null);

  useEffect(() => setSelectedDirectionIndex(null), [routeResult]);

  const onSelectDirection = (index: number, direction: Graphic) => {
    if (selectedDirectionIndex === index) {
      setSelectedDirectionIndex(null);

      if (routeResult && routeResult.geometry && view) {
        view.goTo({
          target: routeResult.geometry,
        });
      }
      return;
    }

    if (direction.geometry && view) {
      // TODO: refactor not using depr methods
      const bufferGeometry = geometryEngine.geodesicBuffer(
        direction.geometry,
        50,
        'feet'
      );

      view.goTo({
        target: bufferGeometry,
      });
      setSelectedDirectionIndex(index);
    }
  };

  return {
    selectedDirectionIndex,
    onSelectDirection,
  };
};
