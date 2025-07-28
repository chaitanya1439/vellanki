import React from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: { minPrice?: number; maxPrice?: number; rating?: number; amenities?: string[] }) => void;
}
export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 mb-4">
      <input type="number" placeholder="Min Price" className="w-24 p-2 border rounded" onChange={e => onFilterChange({ minPrice: +e.target.value })} />
      <input type="number" placeholder="Max Price" className="w-24 p-2 border rounded" onChange={e => onFilterChange({ maxPrice: +e.target.value })} />
      <select className="p-2 border rounded" onChange={e => onFilterChange({ rating: +e.target.value })}>
        <option value="">Any Rating</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
      </select>
      <button onClick={() => onFilterChange({ amenities: ['Wi-Fi'] })} className="px-3 py-1 bg-blue-500 text-white rounded">Wi‑Fi</button>
      <button onClick={() => onFilterChange({ amenities: ['Gym'] })} className="px-3 py-1 bg-blue-500 text-white rounded">Gym</button>
    </div>
  );
}