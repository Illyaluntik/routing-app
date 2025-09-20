import { AutocompleteSuggestion } from '@/hooks/autocomplete/useAutocomplete';
import axios from 'axios';

export const findAddressCandidates = async (s: AutocompleteSuggestion) => {
  try {
    const geocodeResp = await axios.get(
      import.meta.env.VITE_ARCGIS_GEOCODING_FIND_ADDRESS_CANDIDATES,
      {
        params: { f: 'json', magicKey: s.location },
      }
    );

    if (geocodeResp.data.candidates.length > 0) {
      const candidate = geocodeResp.data.candidates[0];
      const coords: [number, number] = [
        candidate.location.x,
        candidate.location.y,
      ];
      return { coords, label: s.label };
    }
  } catch (err) {
    console.error(err);
  }
};
