// components/SearchBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  setValue?: (v: string) => void;
  countryCode?: string;
}

const LIBRARIES: ('places' | 'geometry')[] = ['places','geometry'];

export default function SearchBar({
  onSearch,
  placeholder = 'Search city, property or landmark',
  value: controlledValue,
  setValue: setControlledValue,
  countryCode,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = setControlledValue || setInternalValue;
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use the same loader options everywhere
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
    region: 'IN',
    language: 'en',
  });

  useEffect(() => {
    if (!isClient || !isLoaded || !window.google) return;
    
    if (!serviceRef.current) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded, isClient]);

  useEffect(() => {
    if (!isClient || !value || !serviceRef.current) {
      setPredictions([]);
      return;
    }

    serviceRef.current.getPlacePredictions(
      {
        input: value,
        ...(countryCode ? { componentRestrictions: { country: countryCode } } : {}),
        types: ['geocode'],
      },
      (preds) => {
        setPredictions(preds || []);
        setActiveIndex(-1);
      }
    );
  }, [value, countryCode, isClient]);

  const handleSelect = (desc: string) => {
    setValue(desc);
    setPredictions([]);
    onSearch(desc);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(predictions[activeIndex].description);
    } else if (e.key === 'Enter') {
      onSearch(value.trim());
    }
  };

  if (!isClient) {
    return (
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 shadow-sm"
          disabled
        />
      </div>
    );
  }

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 shadow-sm"
      />
      <span
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        onClick={() => onSearch(value.trim())}
      >
        🔍
      </span>
      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {predictions.map((p, idx) => (
            <li
              key={p.place_id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${idx === activeIndex ? 'bg-gray-100' : ''}`}
              onMouseDown={() => handleSelect(p.description)}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
