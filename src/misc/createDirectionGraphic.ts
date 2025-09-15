import Geometry from '@arcgis/core/geometry/Geometry';
import Graphic from '@arcgis/core/Graphic';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

export const createDirectionGraphic = (geometry: nullish | Geometry) => {
  return new Graphic({
    geometry: geometry,
    symbol: new SimpleLineSymbol({
      color: [0, 76, 153, 1],
      width: 6,
    }),
  });
};
