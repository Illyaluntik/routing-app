import { RouteStop } from '@/hooks/useRoute';
import { createContext, useContext } from 'react';

export interface RouteContextValue {
  stops: RouteStop[];
  setStops: React.Dispatch<React.SetStateAction<RouteStop[]>>;
  updateStop: (
    id: string,
    coords: [number, number] | null,
    label: string
  ) => void;
  removeStop: (id: string) => void;
}
export const RouteContext = createContext<RouteContextValue>(
  undefined as unknown as RouteContextValue
);

export const useRouteContext = () => useContext(RouteContext);
