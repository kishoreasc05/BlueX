import { useState, useMemo } from "react";
import { parseQueryIntent } from "../engine/intent-parser";
import { rankProviders } from "../engine/matchmaker";
import { ParsedIntent, MatchResult } from "../types/ai-search.types";

/**
 * Custom React Hook for Rule-Based AI Search & Matchmaking
 */
export function useAiSearch(initialQuery: string = "", candidateProviders: any[] = []) {
  const [query, setQuery] = useState(initialQuery);

  const parsedIntent: ParsedIntent = useMemo(() => {
    return parseQueryIntent(query);
  }, [query]);

  const matchedResults: MatchResult[] = useMemo(() => {
    if (!candidateProviders || candidateProviders.length === 0) return [];
    return rankProviders(candidateProviders, parsedIntent);
  }, [candidateProviders, parsedIntent]);

  return {
    query,
    setQuery,
    parsedIntent,
    matchedResults,
    topMatch: matchedResults.length > 0 ? matchedResults[0] : null,
  };
}
