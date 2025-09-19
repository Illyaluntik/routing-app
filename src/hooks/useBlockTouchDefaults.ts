import MapView from '@arcgis/core/views/MapView';
import { useEffect } from 'react';

export const useBlockTouchDefaults = (view: MapView | null) => {
  useEffect(() => {
    if (!view?.container) {
      return;
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        e.preventDefault();
      }
    };

    view.container.addEventListener('touchstart', onTouchStart);

    return () => {
      view.container?.removeEventListener('touchstart', onTouchStart);
    };
  }, [view]);
};
