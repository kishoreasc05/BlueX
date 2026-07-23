import { AlertTriangle, TrendingUp, CheckCircle2, Lightbulb, ArrowUpRight } from "lucide-react";
import { generateProviderCoachAdvice, ProviderAnalytics } from "../engine/business-coach";
import { Button } from "@/components/ui/button";

interface AiCoachCardProps {
  analytics?: ProviderAnalytics;
  onApplyAdvice?: (adviceId: string) => void;
}

export function AiCoachCard({ analytics, onApplyAdvice }: AiCoachCardProps) {
  const adviceList = generateProviderCoachAdvice(analytics);

  if (adviceList.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="text-sm font-bold text-emerald-900">Profile Optimized!</h4>
        <p className="text-xs text-emerald-700">
          Your profile meets all high-converting performance benchmarks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">AI Business Coach Insights</h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Data-driven suggestions to maximize booking conversion
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {adviceList.length} Action Items
        </span>
      </div>

      <div className="space-y-3">
        {adviceList.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border space-y-2 transition-all ${
              item.severity === "critical"
                ? "bg-rose-50/50 border-rose-200 text-rose-900"
                : item.severity === "warning"
                  ? "bg-amber-50/50 border-amber-200 text-amber-900"
                  : "bg-blue-50/50 border-blue-200 text-blue-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {item.severity === "critical" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{item.title}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                {item.currentValue} → {item.targetValue}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.action}</p>

            {onApplyAdvice && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApplyAdvice(item.id)}
                className="h-7 px-3 text-[11px] font-bold text-indigo-600 hover:bg-white cursor-pointer gap-1"
              >
                <span>Improve Now</span>
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
