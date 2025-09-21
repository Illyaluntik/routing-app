import { useRoute } from '@/hooks/useRoute';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import {
  RouteContext,
  RouteContextValue,
} from '@/providers/RouteContext/routeContext';
import { useUserPositionContext } from '@/providers/UserPositionContext/userPositionContext';
import { useMemo } from 'react';

interface Props {
  children: React.ReactNode;
}

export const RouteProvider: React.FC<Props> = ({ children }) => {
  const { view, routeLayer, stopsLayer } = useMapViewContext();
  const { position } = useUserPositionContext();
  const route = useRoute(view, position, routeLayer, stopsLayer);

  const contextValue: RouteContextValue = useMemo(() => route, [route]);

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
};
