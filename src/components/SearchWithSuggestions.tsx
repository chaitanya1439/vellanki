import { useState } from "react";
import { Search, MapPin, User, Apple } from "lucide-react";
import { Input } from "@/components/ui/input";

const suggestions = [
  {
    id: 1,
    text: "LB Nagar",
    icon: <MapPin className="h-5 w-5 text-gray-500" />,
    type: "location",
  },
  {
    id: 2,
    text: "Hasland",
    icon: <User className="h-5 w-5 text-gray-500" />,
    type: "person",
  },
  {
    id: 3,
    text: "Apple",
    icon: <Apple className="h-5 w-5 text-gray-500" />,
    type: "brand",
  },
];

export const SearchWithSuggestions = () => {
  const [query, setQuery] = useState("");

  const handleSuggestionClick = (s: typeof suggestions[0]) => {
    setQuery(s.text);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Get what you want…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
        />
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-600">Recent</h3>
        <div className="space-y-2">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSuggestionClick(s)}
              className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="p-2 bg-gray-100 rounded-full">
                {s.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-800">{s.text}</p>
                <p className="text-xs text-gray-500 capitalize">{s.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
