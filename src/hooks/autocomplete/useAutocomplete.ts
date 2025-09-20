import { useUserPosition } from '@/providers/userPositionContext';
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface AutocompleteSuggestion {
  label: string;
  location: string;
}

interface Suggestion {
  text: string;
  magicKey: string;
  isCollection?: boolean;
}

interface SuggestResponse {
  suggestions: Suggestion[];
}

export const useAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { position } = useUserPosition();

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get<SuggestResponse>(
          import.meta.env.VITE_ARCGIS_GEOCODING_SUGGEST,
          {
            params: {
              f: 'json',
              text: query,
              maxSuggestions: 5,
              location: position
                ? `${position.longitude},${position.latitude}`
                : undefined,
            },
          }
        );

        const suggestionsData = response.data.suggestions.map((s) => ({
          label: s.text,
          location: s.magicKey,
        }));

        setSuggestions(suggestionsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [query, position]);

  return { suggestions, loading };
};
