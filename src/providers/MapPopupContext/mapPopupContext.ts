import Point from '@arcgis/core/geometry/Point';
import { createContext, useContext } from 'react';

export interface MapPopupState {
  coords: [number, number];
  label: string;
  location: Point;
}

export interface MapPopupContextValue {
  popupState: MapPopupState | null;
  setPopupState: React.Dispatch<React.SetStateAction<MapPopupState | null>>;
  showDirectionsButtons: boolean;
  popupContainer: HTMLDivElement;
}

export const MapPopupContext = createContext<MapPopupContextValue>(
  undefined as unknown as MapPopupContextValue
);

export const useMapPopupContext = () => useContext(MapPopupContext);
