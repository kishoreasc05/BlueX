import { useState } from "react";
import { DollarSign, Info, CheckCircle2, TrendingUp } from "lucide-react";
import { getPricingBenchmark } from "../engine/pricing-advisor";

interface AiPricingWidgetProps {
  category?: string;
  currentRate?: number;
  onRateChange?: (rate: number) => void;
}

export function AiPricingWidget({
  category = "cleaning",
  currentRate = 42,
  onRateChange,
}: AiPricingWidgetProps) {
  const benchmark = getPricingBenchmark(category);
  const [rate, setRate] = useState(currentRate);

  const handleChange = (newVal: number) => {
    setRate(newVal);
    if (onRateChange) onRateChange(newVal);
  };

  const isOptimal = rate >= benchmark.minRate && rate <= benchmark.maxRate;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">AI Market Rate Benchmarks</h4>
            <p className="text-[10px] text-slate-500 font-medium">
              Swiss regional pricing analysis
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
            isOptimal
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {isOptimal ? "Optimal Competitive Rate" : "Rate Adjustment Suggested"}
        </span>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Min Rate</span>
          <p className="text-sm font-bold text-slate-800">CHF {benchmark.minRate}</p>
        </div>
        <div className="border-x border-slate-100">
          <span className="text-[10px] font-bold text-indigo-500 uppercase">Market Avg</span>
          <p className="text-sm font-extrabold text-indigo-600">CHF {benchmark.avgRate}/hr</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Max Rate</span>
          <p className="text-sm font-bold text-slate-800">CHF {benchmark.maxRate}</p>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Set Hourly Rate:</span>
          <span className="text-indigo-600 font-extrabold text-sm">CHF {rate}/hr</span>
        </div>
        <input
          type="range"
          min={benchmark.minRate - 10}
          max={benchmark.maxRate + 30}
          value={rate}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 font-medium leading-relaxed">
        💡 {benchmark.recommendation}
      </p>
    </div>
  );
}
