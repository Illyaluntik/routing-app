import Geometry from '@arcgis/core/geometry/Geometry';
import Graphic from '@arcgis/core/Graphic';

export const createRouteGraphic = (geometry: nullish | Geometry) => {
  return new Graphic({
    geometry: geometry,
    symbol: {
      type: 'simple-line',
      color: [0, 122, 255, 0.8],
      width: 4,
    },
  });
};
