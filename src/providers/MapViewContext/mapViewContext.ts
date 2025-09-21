import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import { createContext, useContext } from 'react';

export interface MapViewContextValue {
  view: MapView | null;
  mapDiv: React.RefObject<HTMLDivElement | null>;
  routeLayer: GraphicsLayer | null;
  stopsLayer: GraphicsLayer | null;
}

export const MapViewContext = createContext<MapViewContextValue>(
  undefined as unknown as MapViewContextValue
);

export const useMapViewContext = () => useContext(MapViewContext);
