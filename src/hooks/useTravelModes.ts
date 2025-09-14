import { useEffect, useMemo, useState } from 'react';
import * as networkService from '@arcgis/core/rest/networkService.js';
import TravelMode from '@arcgis/core/rest/support/TravelMode.js';

export const DEFAULT_TRAVEL_MODE: TravelMode['type'] = 'automobile';

const travelModeTypeToName: Record<TravelMode['type'], string> = {
  automobile: 'Driving Time',
  walk: 'Walking Time',
  truck: 'Trucking Time',
  other: '',
};

export const useTravelModes = () => {
  const [travelMode, setTravelMode] =
    useState<TravelMode['type']>(DEFAULT_TRAVEL_MODE);
  const [supportedTravelModes, setSupportedTravelModes] = useState<
    TravelMode[] | nullish
  >();
  const selectedTravelMode = useMemo(
    () =>
      supportedTravelModes?.find(
        ({ name }) => name === travelModeTypeToName[travelMode]
      ),
    [travelMode, supportedTravelModes]
  );

  useEffect(() => {
    const fetchTravelModes = async () => {
      const serviceDescription = await networkService.fetchServiceDescription(
        import.meta.env.VITE_ARCGIS_ROUTE_API_SERVICE_URL,
        import.meta.env.VITE_ARCGIS_API_KEY
      );

      setSupportedTravelModes(serviceDescription.supportedTravelModes);
    };

    fetchTravelModes();
  }, []);

  return {
    supportedTravelModes,
    travelMode,
    setTravelMode,
    selectedTravelMode,
  };
};
