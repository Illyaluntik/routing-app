import { createUserLocationGraphic } from '@/misc/createUserLocationGraphic';
import { UserPosition } from '@/providers/UserPositionContext/userPositionContext';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import { useState, useEffect } from 'react';

export const useGeolocation = (view: MapView | null) => {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocationGraphic, setUserLocationGraphic] =
    useState<Graphic | null>(null);

  useEffect(() => {
    if (!view) {
      return;
    }

    const graphic = view.graphics.find(
      (g) => g.attributes.id === 'user-location'
    );
    if (graphic) {
      view.graphics.remove(graphic);
    }

    if (userLocationGraphic) {
      view.graphics.add(userLocationGraphic);
    }
  }, [userLocationGraphic, view]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    const success = (pos: GeolocationPosition) => {
      const position = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      const graphic = createUserLocationGraphic([
        position.longitude,
        position.latitude,
      ]);
      setPosition(position);
      setUserLocationGraphic(graphic);
    };

    const fail = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    navigator.geolocation.getCurrentPosition(success, fail);
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { position, setPosition, error, requestLocation, userLocationGraphic };
};
