import { User } from "lucide-react";
import Link from "next/link";
import { SearchWithSuggestions } from "./SearchWithSuggestions";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Logo / Profile Link */}
        <div>
          <Link
            href="/login"
            className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition"
          >
            <User className="h-8 w-8 text-white" />
          </Link>
        </div>

        {/* Search */}
        <SearchWithSuggestions />

        {/* Location & User Info */}
       
      </div>
    </header>
  );
};
