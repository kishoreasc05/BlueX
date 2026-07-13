import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Star,
  Clock,
  Shield,
  ChevronRight,
  MapPin,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  Building,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PROVIDERS } from "@/customer/mockData";

// Mock AI recommended data matching Screen 3
const INITIAL_RECOMMENDATIONS = [
  {
    ...MOCK_PROVIDERS["clean-shine"],
    matchScore: 98,
    badges: ["Top Match", "Fast Response"],
    description:
      "Premium eco-friendly residential cleaning. Certified team, background-checked with fully insured Swiss standard operations.",
  },
  {
    ...MOCK_PROVIDERS["sarah-keller"],
    matchScore: 94,
    badges: ["Great Value", "Payroll Automated"],
    description:
      "Highly rated independent housekeeper. Hiring is fully compliant and automated through BlueX's built-in AHV pension filing.",
  },
  {
    ...MOCK_PROVIDERS["sparkle-home"],
    matchScore: 92,
    badges: ["Great Value", "Eco Friendly"],
    description:
      "Tailored home cleaning packages with flexible scheduling. Focus on high efficiency and custom care requests.",
  },
];

export function AiMatchPage() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Fetch real contractors as backup/fallback or additional matches
  const { data: realContractors } = useQuery({
    queryKey: ["aiMatchFallbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select("id, name, specialty, hourly_rate, notes")
        .eq("status", "active")
        .limit(3);

      if (error) throw error;
      return data || [];
    },
  });

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
            <Sparkles className="h-6 w-6 text-blue-600 fill-blue-600/10" />
            AI Match Recommendations
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Personalized matches based on your needs and preferences.
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
          <h3 className="font-bold text-slate-950 mb-2">Our Matching Process</h3>
          <p className="mb-2">
            BlueX uses machine learning to score local service providers by evaluating:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>**Service Match:** Historical success rates for your specific request category.</li>
            <li>**Proximity & Availability:** Active providers closest to Zurich, Switzerland.</li>
            <li>
              **Behavioral Score:** Response rates, completion times, and overall customer
              satisfaction.
            </li>
          </ul>
        </div>
      )}

      {/* ── MATCH CRITERIA BANNER ── */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
          <Sparkles className="h-4.5 w-4.5 text-blue-600" />
        </div>
        <div className="text-xs md:text-sm text-blue-800 font-medium">
          Based on your location, preferences and past bookings.
        </div>
      </div>

      {/* ── RECOMMENDATIONS LIST ── */}
      <div className="grid grid-cols-1 gap-5">
        {INITIAL_RECOMMENDATIONS.map((prov) => (
          <div
            key={prov.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6 flex flex-col md:flex-row gap-5 relative"
          >
            {/* Left: Match score badge */}
            <div className="absolute top-4 right-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" />
              {prov.matchScore}% Match
            </div>

            {/* Provider Avatar */}
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative mx-auto md:mx-0">
              <img src={prov.avatar} alt={prov.name} className="h-full w-full object-cover" />
            </div>

            {/* Mid: Content */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
                  {prov.name}
                  {/* Provider Type Badge */}
                  {prov.type === "company" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100/50 uppercase tracking-wider">
                      <Building className="h-2.5 w-2.5" /> Company
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 uppercase tracking-wider">
                      <User className="h-2.5 w-2.5" /> Private
                    </span>
                  )}
                </h3>
                <span className="text-xs font-semibold text-slate-400 mt-0.5 block">
                  {prov.specialtyLabel || prov.specialty}
                </span>
              </div>

              {/* Rating */}
              {prov.rating ? (
                <div className="flex items-center justify-center md:justify-start gap-1.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold text-slate-800">{prov.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({prov.reviewsCount} reviews)</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-semibold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md inline-block max-w-[100px] text-center">
                  New Provider
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                {prov.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-none text-[10px] font-bold px-2 py-0.5 rounded-md"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{prov.description}</p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col items-center md:items-end justify-between gap-4 md:gap-0 shrink-0 md:pl-5 md:border-l border-slate-100 min-w-[160px]">
              <div className="text-center md:text-right">
                <div className="text-2xl font-black text-slate-900 leading-tight">
                  CHF {prov.hourlyRate}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  per hour
                </div>
              </div>

              <div className="space-y-1.5 w-full text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-1 text-[11px] text-slate-400 font-medium mb-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Est. response: {prov.responseTime}
                </div>
                <Button
                  onClick={() => navigate({ to: `/client/providers/${prov.id}` as any })}
                  className="w-full h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Real backup contractors listing for diversity */}
        {realContractors && realContractors.length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">
              Other Potential Matches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {realContractors.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-200 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-2">
                      {c.specialty}
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {c.notes ||
                        "Professional service provider ready to assist with custom home needs."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                    <span className="text-xs font-bold text-slate-800">
                      CHF {Number(c.hourly_rate || 90).toFixed(0)}/hr
                    </span>
                    <Button
                      onClick={() => navigate({ to: `/client/providers/${c.id}` as any })}
                      variant="ghost"
                      className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 rounded-lg cursor-pointer"
                    >
                      View Profile <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
