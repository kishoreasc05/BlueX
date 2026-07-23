import { useMemo } from "react";
import { getPricingBenchmark } from "../engine/pricing-advisor";
import { PricingBenchmark } from "../types/ai-search.types";

/**
 * Custom React Hook for AI Pricing Suggestions
 */
export function useAiPricing(category: string = "cleaning") {
  const benchmark: PricingBenchmark = useMemo(() => {
    return getPricingBenchmark(category);
  }, [category]);

  const evaluateRateFit = (currentRate: number) => {
    if (currentRate < benchmark.minRate) {
      return {
        status: "low",
        text: "Below market average — consider raising to increase earnings.",
      };
    }
    if (currentRate > benchmark.maxRate) {
      return { status: "high", text: "Above market average — may reduce booking volume." };
    }
    return { status: "optimal", text: "Optimal competitive pricing for Swiss region." };
  };

  return {
    benchmark,
    evaluateRateFit,
  };
}
