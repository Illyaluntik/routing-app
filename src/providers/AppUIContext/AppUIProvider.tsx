import {
  AppUIContext,
  AppUIContextValue,
} from '@/providers/AppUIContext/appUIContext';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export const AppUIProvider: React.FC<Props> = ({ children }) => {
  const { view } = useMapViewContext();
  const [routeMinimized, setRouteMinimized] = useState(false);
  const [mapPopupOpen, setMapPopupOpen] = useState(false);

  useEffect(() => {
    if (!view) {
      return;
    }

    const handle = reactiveUtils.watch(
      () => view?.popup?.visible,
      (visible) => {
        setMapPopupOpen(visible ?? false);
      }
    );

    return () => {
      handle.remove();
    };
  }, [view]);

  const contextValue: AppUIContextValue = useMemo(
    () => ({
      routeMinimized,
      setRouteMinimized,
      mapPopupOpen,
      setMapPopupOpen,
    }),
    [routeMinimized, setRouteMinimized, mapPopupOpen, setMapPopupOpen]
  );

  return (
    <AppUIContext.Provider value={contextValue}>
      {children}
    </AppUIContext.Provider>
  );
};
