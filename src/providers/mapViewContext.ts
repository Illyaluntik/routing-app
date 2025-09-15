import type MapView from '@arcgis/core/views/MapView';
import { createContext, useContext } from 'react';

export const MapViewContext = createContext<MapView>(
  undefined as unknown as MapView
);

export const useMapView = () => useContext(MapViewContext);
