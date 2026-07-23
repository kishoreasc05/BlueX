import dataset from "../data/dataset.json";
import { parseQueryIntent } from "./intent-parser";
import { ExpandedJobDescription } from "../types/ai-search.types";

/**
 * AI Job Description Expander Engine (Zero API Costs)
 * Takes a brief user input like "Need painter for 3-bed house"
 * and expands it into a comprehensive, structured job request with scope checklist,
 * estimated completion hours, and recommended budget range.
 */
export function expandJobDescription(userPrompt: string): ExpandedJobDescription {
  const intent = parseQueryIntent(userPrompt);
  const catKey = intent.categoryId || "painting";
  const templates = dataset.jobTemplates as Record<string, any>;
  const template = templates[catKey] || templates.painting;

  const rooms = intent.extractedEntities.rooms || 3;
  const propType = intent.extractedEntities.propertyType || "Residential";
  const issue = intent.extractedEntities.issue || "General Repair";
  const urgencyLabel = intent.isEmergency ? "Emergency" : "Scheduled";

  // Build title
  let title = template.titleTemplate || `${intent.categoryLabel || "Service"} Booking`;
  title = title
    .replace("{rooms}", String(rooms))
    .replace("{propertyType}", propType.charAt(0).toUpperCase() + propType.slice(1))
    .replace("{cleaningType}", "Deep")
    .replace("{urgencyLabel}", urgencyLabel)
    .replace("{issue}", issue);

  // Calculate estimated hours
  let estimatedHours = 3;
  if (template.hoursPerRoom) {
    estimatedHours = rooms * template.hoursPerRoom;
  } else if (template.defaultHours) {
    estimatedHours = template.defaultHours;
  }

  // Calculate budget range based on benchmark
  const benchmarks = (dataset.pricingBenchmarks as Record<string, any>)[catKey] || { avgRate: 60 };
  const minRate = benchmarks.minRate || 50;
  const maxRate = benchmarks.maxRate || 85;

  const suggestedBudgetMin = Math.round(estimatedHours * minRate);
  const suggestedBudgetMax = Math.round(estimatedHours * maxRate);

  const summary = `Professional ${intent.categoryLabel || "service"} request for a ${rooms}-room ${propType}. The project requires qualified Swiss-compliant service providers with complete insurance coverage.`;

  return {
    title,
    summary,
    scopeItems: template.scopeItems || [
      "Initial visual inspection & safety check",
      "Core service execution according to Swiss standards",
      "Quality verification & customer walk-through",
      "Site cleanup & waste disposal",
    ],
    materialsNote:
      template.materialsNote || "All standard tools & equipment provided by the contractor.",
    estimatedHours,
    suggestedBudgetMin,
    suggestedBudgetMax,
    currency: "CHF",
  };
}
