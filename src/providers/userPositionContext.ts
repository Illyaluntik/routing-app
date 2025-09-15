import { createContext, useContext } from 'react';

export interface UserPosition {
  latitude: number;
  longitude: number;
}

export interface UserPositionContextValue {
  position: UserPosition | null;
  setPosition: React.Dispatch<React.SetStateAction<UserPosition>>;
  requestLocation: () => void;
}

export const UserPositionContext = createContext<UserPositionContextValue>(
  undefined as unknown as UserPositionContextValue
);

export const useUserPosition = () => useContext(UserPositionContext);
