import Graphic from '@arcgis/core/Graphic';

export const createPointGraphic = (coords: nullish | [number, number]) => {
  if (!coords) {
    return undefined;
  }

  return new Graphic({
    geometry: {
      type: 'point',
      longitude: coords[0],
      latitude: coords[1],
    },
    symbol: {
      type: 'simple-marker',
      color: 'white',
      size: 8,
    },
  });
};
