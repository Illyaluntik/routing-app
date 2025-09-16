import { RouteResult } from '@/hooks/useRoute';
import { createDirectionGraphic } from '@/misc/createDirectionGraphic';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import { useEffect, useState } from 'react';

/**
 * Hook to manage the selection of a direction steps in a route.
 *
 * @param view
 * @param routeResult
 */
export const useRouteDirection = (
  view: MapView | null,
  routeResult: RouteResult | null
) => {
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedDirectionIndex(null);
    removeDirectionHighlight();
  }, [routeResult]);

  const removeDirectionHighlight = () => {
    if (!view) {
      return;
    }

    const graphic = view.graphics.find(
      (g) => g.attributes.id === 'route-direction'
    );
    if (graphic) {
      view.graphics.remove(graphic);
    }
  };

  const onSelectDirection = (index: number, direction: Graphic) => {
    if (!view) {
      return;
    }

    removeDirectionHighlight();

    if (selectedDirectionIndex === index) {
      setSelectedDirectionIndex(null);

      if (routeResult?.geometry) {
        view.goTo({
          target: routeResult.geometry,
        });
      }
      return;
    }

    if (direction.geometry) {
      const bufferGeometry = geometryEngine.geodesicBuffer(
        direction.geometry,
        50,
        'feet'
      );

      view.goTo({
        target: bufferGeometry,
      });

      view.graphics.add(createDirectionGraphic(direction.geometry));
      setSelectedDirectionIndex(index);
    }
  };

  return {
    selectedDirectionIndex,
    onSelectDirection,
  };
};
