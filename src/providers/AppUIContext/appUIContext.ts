import { createContext, useContext } from 'react';

export interface AppUIContextValue {
  mapPopupOpen: boolean;
  setMapPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  routeMinimized: boolean;
  setRouteMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  stopsListExpanded: boolean;
  setStopsListExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  directionsListExpanded: boolean;
  setDirectionsListExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppUIContext = createContext<AppUIContextValue>(
  undefined as unknown as AppUIContextValue
);

export const useAppUIContext = () => useContext(AppUIContext);
