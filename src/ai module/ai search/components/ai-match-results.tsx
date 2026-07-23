import {
  Star,
  Shield,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  User,
  Building,
} from "lucide-react";
import { MatchResult } from "../types/ai-search.types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

interface AiMatchResultsProps {
  results: MatchResult[];
  onBookProvider?: (providerId: string) => void;
}

export function AiMatchResults({ results, onBookProvider }: AiMatchResultsProps) {
  const navigate = useNavigate();

  if (!results || results.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
        <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Matching Providers Found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Try expanding your search query or adjusting your timeframe to discover available Swiss
          contractors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600/10" />
          <span>AI Ranked Matches ({results.length})</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-400">
          Ranked via Multi-Factor Algorithm
        </span>
      </div>

      <div className="space-y-4">
        {results.map((match, idx) => {
          const p = match.provider;
          const isTop = idx === 0;

          return (
            <div
              key={p.id || idx}
              className={`bg-white rounded-2xl border transition-all p-5 space-y-4 ${
                isTop
                  ? "border-indigo-300 ring-2 ring-indigo-500/10 shadow-md"
                  : "border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    {p.avatar &&
                    !p.avatar.includes("pravatar") &&
                    !p.avatar.includes("unsplash") ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 select-none shadow-sm">
                        {p.type === "company" ? (
                          <Building className="w-6 h-6 text-slate-400" />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    )}
                    {p.type === "company" && (
                      <span
                        className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5"
                        title="Registered Company"
                      >
                        <Shield className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                      {isTop && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide border border-indigo-200">
                          ⭐ #1 Best Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {p.specialtyLabel || p.specialty} · {p.location || "Zurich, Switzerland"}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.rating || 4.9}</span>
                      </div>
                      <span>({p.reviewsCount || p.jobsCompleted || 18} reviews)</span>
                      {p.responseTime && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" /> {p.responseTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score & Rate Badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-indigo-600">
                        {match.totalScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Match Score
                      </span>
                    </div>
                  </div>

                  <div className="sm:mt-2 text-right">
                    <span className="text-lg font-bold text-slate-900">
                      CHF {Number(p.hourlyRate || p.hourly_rate || 85).toFixed(0)}
                    </span>
                    <span className="text-xs text-slate-400">/hr</span>
                  </div>
                </div>
              </div>

              {/* Match Badges & Reason */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {match.matchBadges.map((badge) => (
                    <span
                      key={badge}
                      className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] font-medium text-slate-600 italic">💡 {match.reason}</p>
              </div>

              {/* Match Score Breakdown Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Match Score Breakdown</span>
                  <span className="text-slate-600">
                    Skill {match.breakdown.skillRelevance}% · Price{" "}
                    {match.breakdown.priceCompatibility}% · Speed {match.breakdown.responseSpeed}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${match.breakdown.skillRelevance * 0.35}%` }}
                    className="bg-indigo-500 h-full"
                    title="Skill Match (35%)"
                  />
                  <div
                    style={{ width: `${match.breakdown.priceCompatibility * 0.25}%` }}
                    className="bg-emerald-500 h-full"
                    title="Price Fit (25%)"
                  />
                  <div
                    style={{ width: `${match.breakdown.rating * 0.2}%` }}
                    className="bg-amber-400 h-full"
                    title="Rating (20%)"
                  />
                  <div
                    style={{ width: `${match.breakdown.responseSpeed * 0.2}%` }}
                    className="bg-blue-400 h-full"
                    title="Response Speed (20%)"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: `/client/providers/${p.id}` as any })}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  View Full Profile & Services
                </Button>

                <Button
                  onClick={() => {
                    if (onBookProvider) onBookProvider(p.id);
                    else navigate({ to: `/client/book/${p.id}` as any });
                  }}
                  className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1 cursor-pointer"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
