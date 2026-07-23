import { useState } from "react";
import { Sparkles, ArrowRight, Tag, Eye, EyeOff } from "lucide-react";
import { getRecommendationsForCustomer } from "../engine/recommendations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

interface AiRecommendationsProps {
  bookedCategories?: string[];
}

export function AiRecommendations({ bookedCategories = ["cleaning"] }: AiRecommendationsProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const recommendations = getRecommendationsForCustomer(bookedCategories);

  if (recommendations.length === 0) return null;

  if (hidden) {
    return (
      <div className="flex justify-end animate-in fade-in duration-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHidden(false)}
          className="h-8 px-3.5 rounded-xl border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/10" />
          <span>Show AI Recommendations</span>
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-amber-300">
            <Sparkles className="w-5 h-5 fill-amber-300/20" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">AI Tailored Recommendations</h3>
            <p className="text-xs text-indigo-200 font-medium">
              Based on your booking history & seasonal requirements
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-400/30 uppercase tracking-wider">
            Smart Suggestions
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHidden(true)}
            className="h-7 px-2.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 text-xs font-semibold gap-1 cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 space-y-3 flex flex-col justify-between transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  <Tag className="w-3 h-3" />{" "}
                  {item.type === "subscription" ? "Recurring Plan" : "Recommended Service"}
                </span>
                {item.discountPercentage && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Save {item.discountPercentage}%
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{item.reason}</p>
            </div>

            <Button
              onClick={() =>
                navigate({ to: "/client/search", search: { q: item.category } as any })
              }
              className="w-full h-8 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 text-xs font-bold gap-1 cursor-pointer"
            >
              <span>Explore {item.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
