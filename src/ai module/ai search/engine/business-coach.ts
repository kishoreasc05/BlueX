import dataset from "../data/dataset.json";
import { CoachAdvice } from "../types/ai-search.types";

export interface ProviderAnalytics {
  portfolioCount?: number;
  responseTimeMinutes?: number;
  hourlyRate?: number;
  category?: string;
  viewsCount?: number;
  bookingsCount?: number;
  bioWordCount?: number;
}

/**
 * Provider Business Coach Engine (Zero API Costs)
 * Generates tailored growth advice for providers based on analytics and benchmarks.
 */
export function generateProviderCoachAdvice(analytics: ProviderAnalytics = {}): CoachAdvice[] {
  const adviceList: CoachAdvice[] = [];
  const rules = dataset.coachingRules as Record<string, any>;
  const cat = analytics.category || "cleaning";
  const benchmarks = (dataset.pricingBenchmarks as Record<string, any>)[cat] || { avgRate: 50 };

  // 1. Portfolio Photos Rule
  const photoCount = analytics.portfolioCount ?? 1;
  if (photoCount < rules.portfolioPhotos.minTarget) {
    adviceList.push({
      id: "coach-portfolio",
      metric: "Portfolio Photos",
      currentValue: `${photoCount} image${photoCount === 1 ? "" : "s"}`,
      targetValue: `${rules.portfolioPhotos.minTarget}+ images`,
      severity: "warning",
      title: "Upload Portfolio Images",
      action: rules.portfolioPhotos.impact,
    });
  }

  // 2. Response Time Rule
  const respTime = analytics.responseTimeMinutes ?? 45;
  if (respTime > rules.responseTimeMinutes.maxTarget) {
    adviceList.push({
      id: "coach-response-time",
      metric: "Avg Response Time",
      currentValue: `${respTime} mins`,
      targetValue: `< ${rules.responseTimeMinutes.maxTarget} mins`,
      severity: "critical",
      title: "Improve Response Speed",
      action: rules.responseTimeMinutes.impact,
    });
  }

  // 3. Pricing Benchmark Rule
  const rate = analytics.hourlyRate ?? 65;
  const avgRate = benchmarks.avgRate;
  if (rate > avgRate * 1.15) {
    const diffPct = Math.round(((rate - avgRate) / avgRate) * 100);
    adviceList.push({
      id: "coach-pricing",
      metric: "Hourly Rate",
      currentValue: `CHF ${rate}/hr`,
      targetValue: `CHF ${avgRate} - ${Math.round(avgRate * 1.1)}/hr`,
      severity: "tip",
      title: "Optimize Hourly Rate",
      action: `Your hourly rate is ${diffPct}% higher than the local market average (CHF ${avgRate}/hr). Adjusting your rate slightly will boost your booking conversion.`,
    });
  }

  // 4. Bio Completeness Rule
  const bioWords = analytics.bioWordCount ?? 15;
  if (bioWords < rules.bioCompleteness.minTarget) {
    adviceList.push({
      id: "coach-bio",
      metric: "Profile Bio",
      currentValue: `${bioWords} words`,
      targetValue: `${rules.bioCompleteness.minTarget}+ words`,
      severity: "warning",
      title: "Expand Profile Biography",
      action: rules.bioCompleteness.impact,
    });
  }

  // 5. Booking Conversion Rate Rule
  const views = analytics.viewsCount ?? 120;
  const bookings = analytics.bookingsCount ?? 6;
  const conversionPct = Math.round((bookings / Math.max(views, 1)) * 100);
  if (conversionPct < 10) {
    adviceList.push({
      id: "coach-conversion",
      metric: "Booking Conversion",
      currentValue: `${conversionPct}%`,
      targetValue: "15%+",
      severity: "warning",
      title: "Boost Profile Conversion",
      action: `Your profile receives strong views (${views}), but converts at ${conversionPct}%. Add customer reviews and update your availability to close more bookings.`,
    });
  }

  return adviceList;
}
