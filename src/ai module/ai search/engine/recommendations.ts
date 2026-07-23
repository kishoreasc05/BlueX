import dataset from "../data/dataset.json";
import { Recommendation } from "../types/ai-search.types";

/**
 * Customer Recommendation Engine
 * Analyzes customer booking history & current context to recommend
 * relevant cross-sells and subscription packages.
 */
export function getRecommendationsForCustomer(
  pastBookedCategories: string[] = ["cleaning"],
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const rules = dataset.recommendationRules as Record<string, any>;

  pastBookedCategories.forEach((catKey) => {
    const catRules = rules[catKey];
    if (catRules) {
      // 1. Cross-sells
      if (catRules.crossSell && Array.isArray(catRules.crossSell)) {
        catRules.crossSell.forEach((item: any, idx: number) => {
          recommendations.push({
            id: `rec-${catKey}-cross-${idx}`,
            title: item.title,
            category: item.category || catKey,
            reason: item.reason,
            type: "cross_sell",
          });
        });
      }

      // 2. Subscriptions
      if (catRules.subscription) {
        recommendations.push({
          id: `rec-${catKey}-sub`,
          title: catRules.subscription.title,
          category: catKey,
          reason: catRules.subscription.description,
          type: "subscription",
          discountPercentage: catRules.subscription.discountPercentage,
        });
      }
    }
  });

  // Default fallback recommendation if no history matches
  if (recommendations.length === 0) {
    recommendations.push(
      {
        id: "rec-default-1",
        title: "Weekly Cleaning Plan",
        category: "cleaning",
        reason: "Save 15% on regular home maintenance with automated Swiss AHV payroll filing.",
        type: "subscription",
        discountPercentage: 15,
      },
      {
        id: "rec-default-2",
        title: "Seasonal Garden Care",
        category: "gardening",
        reason: "Keep lawns and hedges in top condition throughout the season.",
        type: "cross_sell",
      },
    );
  }

  return recommendations;
}
