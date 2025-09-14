import { RouteStop } from '@/hooks/useRoute';
import { createContext } from 'react';

type StopsContextType = {
  stops: RouteStop[];
  setStops: React.Dispatch<React.SetStateAction<RouteStop[]>>;
  updateStop: (id: string, coords: [number, number] | null, label: string) => void;
  removeStop: (id: string) => void;
};
export const StopsContext = createContext<StopsContextType>(
  undefined as unknown as StopsContextType
);
