import { useState } from "react";
import { Search, Sparkles, Zap, Clock, DollarSign, Tag, X } from "lucide-react";
import { parseQueryIntent } from "../engine/intent-parser";
import { Button } from "@/components/ui/button";

interface AiSearchBarProps {
  initialQuery?: string;
  onSearchSubmit: (query: string) => void;
  placeholder?: string;
}

export function AiSearchBar({
  initialQuery = "",
  onSearchSubmit,
  placeholder = "e.g., I need someone to paint my 3-bedroom house next week within CHF 1500",
}: AiSearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const parsedIntent = parseQueryIntent(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearchSubmit(value);
    }
  };

  const clearQuery = () => {
    setValue("");
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-indigo-600 flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-5 h-5 fill-indigo-600/10" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-13 pl-12 pr-28 rounded-2xl border-2 border-indigo-100 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all font-medium"
        />
        {value && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-24 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Button
          type="submit"
          className="absolute right-2 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Search
        </Button>
      </form>

      {/* Live Intent Parsing Badges / Chips */}
      {value.trim().length > 3 && (
        <div className="flex flex-wrap items-center gap-2 px-1 animate-in fade-in-50 duration-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3 text-indigo-500" /> Detected Intent:
          </span>

          {parsedIntent.categoryLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Category: {parsedIntent.categoryLabel}
            </span>
          )}

          {parsedIntent.isEmergency && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 animate-pulse">
              <Zap className="w-3 h-3 fill-rose-500" />
              Emergency Request
            </span>
          )}

          {parsedIntent.timeframe && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
              <Clock className="w-3 h-3 text-emerald-500" />
              Timeframe: {parsedIntent.timeframe.label}
            </span>
          )}

          {parsedIntent.budget && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
              <DollarSign className="w-3 h-3 text-amber-500" />
              Budget: {parsedIntent.budget.currency} {parsedIntent.budget.amount}
            </span>
          )}

          {parsedIntent.extractedEntities.rooms && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
              {parsedIntent.extractedEntities.rooms} Rooms
            </span>
          )}
        </div>
      )}
    </div>
  );
}
