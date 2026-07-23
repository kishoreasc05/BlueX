export interface CategoryInfo {
  id: string;
  label: string;
  slug: string;
  icon: string;
  synonyms: string[];
  urgencyKeywords: string[];
  services: string[];
}

export interface ParsedIntent {
  rawQuery: string;
  categoryId: string | null;
  categoryLabel: string | null;
  categorySlug: string | null;
  isEmergency: boolean;
  timeframe: {
    label: string;
    urgency: "critical" | "high" | "medium" | "normal" | "low";
  } | null;
  budget: {
    amount: number;
    type: "exact" | "max" | "hourly";
    currency: string;
  } | null;
  extractedEntities: {
    rooms?: number;
    propertyType?: string;
    issue?: string;
  };
}

export interface MatchScoreBreakdown {
  skillRelevance: number; // 0..100
  priceCompatibility: number; // 0..100
  rating: number; // 0..100
  proximity: number; // 0..100
  responseSpeed: number; // 0..100
}

export interface MatchResult {
  provider: any;
  totalScore: number; // 0..100 weighted
  breakdown: MatchScoreBreakdown;
  matchBadges: string[];
  reason: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  reason: string;
  type: "cross_sell" | "subscription";
  discountPercentage?: number;
}

export interface CoachAdvice {
  id: string;
  metric: string;
  currentValue: string | number;
  targetValue: string | number;
  severity: "critical" | "warning" | "tip";
  title: string;
  action: string;
}

export interface PricingBenchmark {
  category: string;
  avgRate: number;
  minRate: number;
  maxRate: number;
  currency: string;
  unit: string;
  recommendation: string;
}

export interface ExpandedJobDescription {
  title: string;
  summary: string;
  scopeItems: string[];
  materialsNote: string;
  estimatedHours: number;
  suggestedBudgetMin: number;
  suggestedBudgetMax: number;
  currency: string;
}
