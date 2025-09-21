import { useMapPopupContext } from '@/providers/MapPopupContext/mapPopupContext';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import * as locator from '@arcgis/core/rest/locator.js';
import { useEffect } from 'react';

export const useMapClickPopup = () => {
  const { view } = useMapViewContext();
  const { setPopupState, popupContainer } = useMapPopupContext();

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
          import.meta.env.VITE_ARCGIS_GEOCODING,
          { location: mapPoint }
        );

        const label =
          result.address || `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`;

        setPopupState({
          coords,
          label,
          location: mapPoint,
        });
      } catch (err) {
        console.error('Reverse geocode failed', err);
      }
    });

    return () => handler.remove();
  }, [view, setPopupState, popupContainer]);
};
