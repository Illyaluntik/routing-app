import { InitialRoutePoint, RouteResult, RouteStop } from '@/hooks/useRoute';
import TravelMode from '@arcgis/core/rest/support/TravelMode';
import { createContext, useContext } from 'react';

export interface RouteContextValue {
  stops: RouteStop[];
  hasUnfilledStops: boolean;
  routeResult: RouteResult | null;
  setStops: React.Dispatch<React.SetStateAction<RouteStop[]>>;
  updateStop: (
    id: string,
    coords: [number, number] | null,
    label: string
  ) => void;
  removeStop: (id: string) => void;
  addStop: () => string | undefined;
  createInitialRoute: (
    start?: InitialRoutePoint,
    end?: InitialRoutePoint
  ) => void;
  addStopFromMap: (coords: [number, number] | null, label: string) => void;
  travelMode: TravelMode['type'];
  setTravelMode: React.Dispatch<React.SetStateAction<TravelMode['type']>>;
  resetRoute: () => void;
  error: string | null;
}
export const RouteContext = createContext<RouteContextValue>(
  undefined as unknown as RouteContextValue
);

export const useRouteContext = () => useContext(RouteContext);
