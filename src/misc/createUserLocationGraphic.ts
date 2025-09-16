import Graphic from '@arcgis/core/Graphic';

export const createUserLocationGraphic = (
  coords: nullish | [number, number]
) => {
  if (!coords) {
    return null;
  }

  return new Graphic({
    attributes: {
      id: 'user-location',
    },
    geometry: {
      type: 'point',
      longitude: coords[0],
      latitude: coords[1],
    },
    symbol: {
      type: 'simple-marker',
      style: 'circle',
      color: [0, 122, 255, 0.8],
      size: 10,
      outline: {
        color: [255, 255, 255, 1],
        width: 2,
      },
    },
  });
};
