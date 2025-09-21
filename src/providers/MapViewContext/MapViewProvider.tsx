import { useBlockTouchDefaults } from '@/hooks/useBlockTouchDefaults';
import { useMap } from '@/hooks/useMap';
import {
  MapViewContext,
  MapViewContextValue,
} from '@/providers/MapViewContext/mapViewContext';
import { useMemo } from 'react';

interface Props {
  children: React.ReactNode;
}

export const MapViewProvider: React.FC<Props> = ({ children }) => {
  const { view, mapDiv, routeLayer, stopsLayer } = useMap();
  useBlockTouchDefaults(view);

  const contextValue: MapViewContextValue = useMemo(
    () => ({
      view,
      mapDiv,
      routeLayer,
      stopsLayer,
    }),
    [view, mapDiv, routeLayer, stopsLayer]
  );

  return (
    <MapViewContext.Provider value={contextValue}>
      {children}
    </MapViewContext.Provider>
  );
};
