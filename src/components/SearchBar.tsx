import { Autocomplete } from '@/components/Autocomplete/Autocomplete';
import { AutocompleteSuggestion } from '@/hooks/autocomplete/useAutocomplete';
import { createPointGraphic } from '@/misc/createPointGraphic';
import { findAddressCandidates } from '@/misc/findAddressCandidates';
import { useMapPopupContext } from '@/providers/MapPopupContext/mapPopupContext';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import Point from '@arcgis/core/geometry/Point';

export const SearchBar = () => {
  const { view } = useMapViewContext();

  const { setPopupState } = useMapPopupContext();

  const searchLocation = async (s: AutocompleteSuggestion) => {
    if (!view) {
      return;
    }

    const result = await findAddressCandidates(s);

    if (!result) {
      return;
    }

    view.goTo(
      {
        target: createPointGraphic(result.coords),
        zoom: 20,
      },
      { duration: 2500 }
    );

    const location = new Point({
      longitude: result.coords[0],
      latitude: result.coords[1],
    });

    setPopupState({
      coords: result.coords,
      label: result.label,
      location,
    });
  };

  return (
    <div className="absolute top-5 left-5 z-60 flex flex-col gap-2.5 bg-white/70 rounded-md shadow-md w-full max-w-[calc(100vw-40px)] sm:max-w-[400px]">
      <div className="backdrop-blur-sm p-2.5 !rounded-md h-[60px] flex items-center gap-2.5">
        <img src="logo.svg" className="h-full w-auto rounded-sm shadow-sm" />
        <div className="w-full max-w-[350px]">
          <Autocomplete
            onSelect={searchLocation}
            placeholder="Search or Click on Map"
            className="shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
