import { useMemo } from "react";
import { generateProviderCoachAdvice, ProviderAnalytics } from "../engine/business-coach";
import { CoachAdvice } from "../types/ai-search.types";

/**
 * Custom React Hook for Provider AI Business Coach
 */
export function useAiCoach(analytics?: ProviderAnalytics) {
  const coachAdvice: CoachAdvice[] = useMemo(() => {
    return generateProviderCoachAdvice(analytics);
  }, [analytics]);

  const criticalCount = coachAdvice.filter((a) => a.severity === "critical").length;
  const warningCount = coachAdvice.filter((a) => a.severity === "warning").length;

  return {
    coachAdvice,
    criticalCount,
    warningCount,
    hasSuggestions: coachAdvice.length > 0,
  };
}
