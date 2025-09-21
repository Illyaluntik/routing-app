import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';

export const MapContainer = () => {
  const { mapDiv } = useMapViewContext();

  return <div ref={mapDiv} className="h-full w-full" />;
};
