import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiMatchmaker } from "@/ai module/ai search/hooks/use-ai-matchmaker";
import { AiSearchBar } from "@/ai module/ai search/components/ai-search-bar";
import { AiMatchResults } from "@/ai module/ai search/components/ai-match-results";
import { AiRecommendations } from "@/ai module/ai search/components/ai-recommendations";

export function AiMatchPage() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const { searchQuery, setSearchQuery, matchedResults } = useAiMatchmaker(
    "I need someone to paint my 3-bedroom house next week within CHF 1500",
  );

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-600">AI Match</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <Sparkles className="h-6 w-6 text-indigo-600 fill-indigo-600/10" />
            AI Match & Provider Finder
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Zero-API rule-based intent matching for Swiss service providers.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="rounded-xl text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          How it works
        </Button>
      </div>

      {/* ── HOW IT WORKS DETAILS ── */}
      {showHowItWorks && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm leading-relaxed text-slate-600 animate-in fade-in duration-200">
          <h3 className="font-bold text-slate-950 mb-2">Our Deterministic Matching Algorithm</h3>
          <p className="mb-2">
            BlueX uses multi-factor rule scoring to rank local service providers by evaluating:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Skill Relevance (35%):</strong> Keyword and category match against query
              intent.
            </li>
            <li>
              <strong>Price Fit (25%):</strong> Hourly rate fit against budget constraints & market
              benchmark.
            </li>
            <li>
              <strong>Rating & Reviews (20%):</strong> Weighted customer review score and completion
              history.
            </li>
            <li>
              <strong>Proximity (10%):</strong> Distance from Zurich, Switzerland.
            </li>
            <li>
              <strong>Response Speed (10%):</strong> Fast response time priority.
            </li>
          </ul>
        </div>
      )}

      {/* ── AI SEARCH INPUT ── */}
      <AiSearchBar
        initialQuery={searchQuery}
        onSearchSubmit={(q) => setSearchQuery(q)}
        placeholder="e.g., Need someone to fix leaking kitchen pipe tomorrow within CHF 200"
      />

      {/* ── AI RECOMMENDATIONS BANNER ── */}
      <AiRecommendations bookedCategories={["cleaning", "plumbing"]} />

      {/* ── AI MATCHED RESULTS ── */}
      <AiMatchResults
        results={matchedResults}
        onBookProvider={(provId) => navigate({ to: `/client/book/${provId}` as any })}
      />
    </div>
  );
}
