import dataset from "../data/dataset.json";
import { PricingBenchmark } from "../types/ai-search.types";

/**
 * Pricing Benchmark Advisor Engine
 * Calculates Swiss market average hourly rate and recommended competitive ranges.
 */
export function getPricingBenchmark(category: string = "cleaning"): PricingBenchmark {
  const benchmarks = dataset.pricingBenchmarks as Record<string, any>;
  const catKey = category.toLowerCase();
  const benchmark = benchmarks[catKey] || benchmarks.cleaning;

  const recMin = Math.round(benchmark.avgRate * 0.95);
  const recMax = Math.round(benchmark.avgRate * 1.08);

  return {
    category: benchmark.category,
    avgRate: benchmark.avgRate,
    minRate: benchmark.minRate,
    maxRate: benchmark.maxRate,
    currency: benchmark.currency || "CHF",
    unit: benchmark.unit || "hour",
    recommendation: `Average market rate is CHF ${benchmark.avgRate}/hour. We recommend setting your price between CHF ${recMin}–${recMax}/hour for optimal booking volume.`,
  };
}
