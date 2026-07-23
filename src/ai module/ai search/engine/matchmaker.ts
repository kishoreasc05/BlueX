import dataset from "../data/dataset.json";
import { ParsedIntent, MatchResult, MatchScoreBreakdown } from "../types/ai-search.types";

/**
 * Deterministic Multi-Factor Provider Matchmaker & Ranking Engine
 * Evaluates candidate providers against a parsed user intent and calculates:
 * - Skill Relevance (35%)
 * - Price Compatibility (25%)
 * - Rating & Reviews (20%)
 * - Proximity / Location (10%)
 * - Response Speed (10%)
 */
export function calculateProviderMatch(
  provider: any,
  intent: ParsedIntent,
  userLocation: { lat?: number; lng?: number } = { lat: 47.3769, lng: 8.5417 },
): MatchResult {
  // 1. Skill Relevance (35 points)
  let skillRelevance = 40; // baseline
  const provSpecialty = (provider.specialty || "").toLowerCase();
  const provServices = (provider.services || []).map((s: string) => s.toLowerCase());

  if (intent.categorySlug && provSpecialty.includes(intent.categorySlug)) {
    skillRelevance = 90;
  } else if (intent.categoryId && provSpecialty.includes(intent.categoryId)) {
    skillRelevance = 85;
  }

  // Bonus for specific service matches
  if (intent.extractedEntities.issue) {
    const issueMatch = provServices.some((s: string) =>
      s.includes(intent.extractedEntities.issue!.toLowerCase()),
    );
    if (issueMatch) skillRelevance = Math.min(skillRelevance + 10, 100);
  }
  const skillScore = (skillRelevance / 100) * 35;

  // 2. Price Compatibility (25 points)
  let priceCompatibility = 80;
  const provRate = Number(provider.hourlyRate || provider.hourly_rate || 75);
  const catBenchmark = intent.categoryId
    ? (dataset.pricingBenchmarks as Record<string, any>)[intent.categoryId]
    : null;
  const avgRate = catBenchmark ? catBenchmark.avgRate : 60;

  if (intent.budget) {
    if (intent.budget.type === "hourly") {
      const diff = Math.abs(provRate - intent.budget.amount);
      priceCompatibility = Math.max(100 - (diff / intent.budget.amount) * 100, 20);
    } else if (intent.budget.type === "max" || intent.budget.type === "exact") {
      const estTotalJobCost =
        provRate * (intent.extractedEntities.rooms ? intent.extractedEntities.rooms * 3 : 4);
      if (estTotalJobCost <= intent.budget.amount) {
        priceCompatibility = 95;
      } else {
        const overPercent = ((estTotalJobCost - intent.budget.amount) / intent.budget.amount) * 100;
        priceCompatibility = Math.max(90 - overPercent, 10);
      }
    }
  } else {
    // Standard market baseline comparison
    const dev = Math.abs(provRate - avgRate);
    priceCompatibility = Math.max(95 - (dev / avgRate) * 50, 40);
  }
  const priceScore = (priceCompatibility / 100) * 25;

  // 3. Rating & Reviews (20 points)
  const rating = Number(provider.rating || 4.8);
  const reviewsCount = Number(provider.reviewsCount || provider.jobsCompleted || 12);
  const ratingFactor = (rating / 5) * 80 + Math.min(reviewsCount / 20, 1) * 20; // 0..100
  const ratingScore = (ratingFactor / 100) * 20;

  // 4. Proximity (10 points)
  // Distance decay approximation
  const distanceKm = provider.dist !== undefined ? provider.dist : 2.5;
  const proximityFactor = Math.max(100 - distanceKm * 10, 30);
  const proximityScore = (proximityFactor / 100) * 10;

  // 5. Response Speed (10 points)
  let responseMinutes = 45;
  if (provider.responseTime) {
    if (provider.responseTime.includes("15")) responseMinutes = 15;
    else if (provider.responseTime.includes("30")) responseMinutes = 30;
    else if (provider.responseTime.includes("1 hour")) responseMinutes = 60;
  }
  const speedFactor = intent.isEmergency
    ? Math.max(100 - (responseMinutes / 30) * 50, 20)
    : Math.max(100 - (responseMinutes / 120) * 50, 40);
  const speedScore = (speedFactor / 100) * 10;

  // Total Score (0..100)
  const totalScore = Math.min(
    Math.round(skillScore + priceScore + ratingScore + proximityScore + speedScore),
    99,
  );

  // Match Badges
  const matchBadges: string[] = [];
  if (totalScore >= 92) matchBadges.push("Top Match");
  if (priceCompatibility >= 88) matchBadges.push("Best Value");
  if (speedFactor >= 85) matchBadges.push("Fast Response");
  if (rating >= 4.8) matchBadges.push("Top Rated");
  if (provider.type === "company" || provider.is_verified) matchBadges.push("Swiss Verified");

  // Recommendation Reason
  let reason = `Strong overall fit based on ${intent.categoryLabel || "requested service"}`;
  if (intent.budget && priceCompatibility >= 85) {
    reason = `Fits within your budget of CHF ${intent.budget.amount}`;
  } else if (intent.isEmergency && speedFactor >= 85) {
    reason = `Fastest emergency response time for ${intent.categoryLabel}`;
  } else if (rating >= 4.8) {
    reason = `Highly rated ${provider.specialtyLabel || intent.categoryLabel} with ${rating}★ score`;
  }

  const breakdown: MatchScoreBreakdown = {
    skillRelevance: Math.round(skillRelevance),
    priceCompatibility: Math.round(priceCompatibility),
    rating: Math.round(ratingFactor),
    proximity: Math.round(proximityFactor),
    responseSpeed: Math.round(speedFactor),
  };

  return {
    provider,
    totalScore,
    breakdown,
    matchBadges,
    reason,
  };
}

export function rankProviders(
  providers: any[],
  intent: ParsedIntent,
  userLocation?: { lat?: number; lng?: number },
): MatchResult[] {
  return providers
    .map((p) => calculateProviderMatch(p, intent, userLocation))
    .sort((a, b) => b.totalScore - a.totalScore);
}
