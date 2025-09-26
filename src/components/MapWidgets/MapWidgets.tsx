import { BasemapWidget } from '@/components/MapWidgets/BasemapWidget';
import { LocateWidget } from '@/components/MapWidgets/LocateWidget';
import { MapPopupWidget } from '@/components/MapWidgets/MapPopupWidget';
import { MapRotationWidget } from '@/components/MapWidgets/MapRotationWidget';
import { RouteDetailToggleWidget } from '@/components/MapWidgets/RouteDetailToggleWidget';
import { ZoomWidget } from '@/components/MapWidgets/ZoomWidget';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMapClickPopup } from '@/hooks/useMapClickPopup';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';

export const MapWidgets = () => {
  const isMobile = useIsMobile(1024);
  const { mapPopupOpen, routeMinimized } = useAppUIContext();
  useMapClickPopup();

  return (
    <>
      <div className="absolute top-[90px] lg:top-auto lg:bottom-5 left-5 z-40 flex flex-col gap-1">
        <MapRotationWidget className="order-last lg:order-none" />
        <BasemapWidget />
        <LocateWidget />
        <ZoomWidget />
      </div>

      {((isMobile && !mapPopupOpen) || !isMobile) && routeMinimized && (
        <RouteDetailToggleWidget className="absolute bottom-5 lg:bottom-auto lg:top-5 right-5 z-40" />
      )}

      <MapPopupWidget />
    </>
  );
};
