import { DEFAULT_BASEMAP } from '@/config/basemaps';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { useState, useEffect, useRef } from 'react';

export const useMap = () => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);
  const [routeLayer, setRouteLayer] = useState<GraphicsLayer | null>(null);
  const [stopsLayer, setStopsLayer] = useState<GraphicsLayer | null>(null);

  useEffect(() => {
    if (!mapDiv.current) {
      return;
    }

    const map = new Map({
      basemap: DEFAULT_BASEMAP.id,
    });

    const viewInstance = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4,
      constraints: {
        minZoom: 2,
      },
      ui: {
        components: [],
      },
      popupEnabled: false,
    });

    viewInstance.popup = {
      visible: true,
      dockOptions: {
        buttonEnabled: false,
      },
      dockEnabled: false,
      visibleElements: {
        collapseButton: false,
        closeButton: false,
        featureNavigation: false,
        actionBar: false,
      },
    };

    const routeLayer = new GraphicsLayer();
    const stopsLayer = new GraphicsLayer();

    map.addMany([routeLayer, stopsLayer]);

    setRouteLayer(routeLayer);
    setStopsLayer(stopsLayer);
    setView(viewInstance);

    return () => {
      viewInstance.destroy();
    };
  }, []);

  return {
    mapDiv,
    view,
    routeLayer,
    stopsLayer,
  };
};
