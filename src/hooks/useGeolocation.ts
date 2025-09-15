import { UserPosition } from '@/providers/userPositionContext';
import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    const success = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    };

    const fail = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    navigator.geolocation.getCurrentPosition(success, fail);
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { position, setPosition, error, requestLocation };
};
