import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import {
  UserPositionContext,
  UserPositionContextValue,
} from '@/providers/UserPositionContext/userPositionContext';
import { useMemo } from 'react';

interface Props {
  children: React.ReactNode;
}

export const UserPositionProvider: React.FC<Props> = ({ children }) => {
  const { view } = useMapViewContext();
  const { position, setPosition, requestLocation } = useGeolocation(view);

  const contextValue: UserPositionContextValue = useMemo(
    () => ({
      position,
      setPosition,
      requestLocation,
    }),
    [position, setPosition, requestLocation]
  );

  return (
    <UserPositionContext.Provider value={contextValue}>
      {children}
    </UserPositionContext.Provider>
  );
};
