import { Button } from '@/components/ui/button';
import { XButton } from '@/components/XButton';
import { useMapPopupContext } from '@/providers/MapPopupContext/mapPopupContext';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { MapPinPlusInside } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const MapPopupWidget = () => {
  const { view } = useMapViewContext();
  const { createInitialRoute, addStopFromMap } = useRouteContext();
  const { popupState, setPopupState, popupContainer, showDirectionsButtons } =
    useMapPopupContext();

  useEffect(() => {
    if (!view || !popupState) {
      return;
    }

    view.openPopup({
      location: popupState.location,
      content: popupContainer,
    });
  }, [view, popupState, popupContainer]);

  if (!view || !popupState) {
    return null;
  }

  const closePopup = () => {
    view.closePopup();
    setPopupState(null);
  };

  return createPortal(
    <>
      <XButton
        onClick={() => {
          closePopup();
        }}
        className="absolute top-0 right-0 z-50"
      />
      <div className="mb-1 text-xl font-semibold pr-5">{popupState.label}</div>
      <div className="text-xs text-gray-400 mb-5">
        {popupState.coords[1].toFixed(5)}, {popupState.coords[0].toFixed(5)}
      </div>
      <div className="flex items-center gap-2.5">
        {showDirectionsButtons && (
          <>
            <Button
              className="flex-1 cursor-pointer"
              onClick={() => {
                createInitialRoute(undefined, popupState);
                closePopup();
              }}
            >
              Directions
            </Button>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => {
                createInitialRoute(popupState, undefined);
                closePopup();
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
              addStopFromMap(popupState.coords, popupState.label);
              closePopup();
            }}
          >
            Add Stop
            <MapPinPlusInside />
          </Button>
        )}
      </div>
    </>,
    popupContainer
  );
};
