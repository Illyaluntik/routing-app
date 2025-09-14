import { MapPinPlusInside, X } from 'lucide-react';
import { Button } from './ui/button';
import MapView from '@arcgis/core/views/MapView';
import { InitialRoutePoint } from '@/hooks/useRoute';

interface Props {
  view: MapView;
  label: string;
  coords: [number, number];
  createInitialRoute: (
    start?: InitialRoutePoint,
    end?: InitialRoutePoint
  ) => void;
  addStop: (coords: [number, number], label: string) => void;
  showDirectionsButtons?: boolean;
}

export const MapPopup: React.FC<Props> = ({
  view,
  label,
  coords,
  showDirectionsButtons,
  createInitialRoute,
  addStop,
}) => (
  <>
    <Button
      className="absolute top-0 right-0 cursor-pointer"
      size="icon"
      variant="ghost"
      onClick={() => {
        view.closePopup();
      }}
    >
      <X />
    </Button>
    <div className="mb-1 text-xl font-semibold">{label}</div>
    <div className="text-xs text-gray-400 mb-5">
      {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
    </div>
    <div className="flex items-center gap-2.5">
      {showDirectionsButtons && (
        <>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => {
              createInitialRoute(undefined, { coords, label });
              view.closePopup();
            }}
          >
            Directions
          </Button>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => {
              createInitialRoute({ coords, label }, undefined);
              view.closePopup();
            }}
          >
            Route From Here
          </Button>
        </>
      )}
      {!showDirectionsButtons && (
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => {
            addStop(coords, label);
            view.closePopup();
          }}
        >
          Add Stop
          <MapPinPlusInside />
        </Button>
      )}
    </div>
  </>
);
