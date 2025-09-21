import {
  MapPopupContext,
  MapPopupContextValue,
  MapPopupState,
} from '@/providers/MapPopupContext/mapPopupContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { useMemo, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export const MapPopupProvider: React.FC<Props> = ({ children }) => {
  const { stops } = useRouteContext();
  const [popupState, setPopupState] = useState<MapPopupState | null>(null);
  const popupContainer = useMemo(() => document.createElement('div'), []);
  const showDirectionsButtons = useMemo(() => stops.length === 0, [stops]);

  const contextValue: MapPopupContextValue = useMemo(
    () => ({
      popupState,
      setPopupState,
      showDirectionsButtons,
      popupContainer,
    }),
    [popupState, setPopupState, showDirectionsButtons, popupContainer]
  );

  return (
    <MapPopupContext.Provider value={contextValue}>
      {children}
    </MapPopupContext.Provider>
  );
};
