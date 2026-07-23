import dataset from "../data/dataset.json";
import { ParsedIntent } from "../types/ai-search.types";

/**
 * Deterministic Rule-Based Intent Parser (Zero API Costs)
 * Transforms free-text queries like "I need someone to paint my 3-bedroom house next week within CHF 1500"
 * into a structured ParsedIntent object.
 */
export function parseQueryIntent(query: string): ParsedIntent {
  const cleanQuery = (query || "").trim();
  const lowerQuery = cleanQuery.toLowerCase();

  // 1. Detect Category Match by counting synonym hits
  let bestCategoryKey: string | null = null;
  let highestScore = 0;

  const categories = dataset.categories as Record<string, any>;
  Object.entries(categories).forEach(([catKey, catData]) => {
    let hits = 0;
    catData.synonyms.forEach((syn: string) => {
      if (lowerQuery.includes(syn.toLowerCase())) {
        hits += 1;
      }
    });
    if (hits > highestScore) {
      highestScore = hits;
      bestCategoryKey = catKey;
    }
  });

  const matchedCat = bestCategoryKey ? categories[bestCategoryKey] : null;

  // 2. Detect Emergency / Urgency
  let isEmergency = false;
  if (matchedCat && matchedCat.urgencyKeywords) {
    isEmergency = matchedCat.urgencyKeywords.some((kw: string) => lowerQuery.includes(kw));
  } else {
    isEmergency = /\b(emergency|urgent|flooding|burst|now|asap|today)\b/i.test(lowerQuery);
  }

  // 3. Extract Timeframe
  let timeframeResult: ParsedIntent["timeframe"] = null;
  const timePatterns = dataset.timeframePatterns as Array<{
    regex: string;
    label: string;
    urgency: any;
  }>;
  for (const tp of timePatterns) {
    const reg = new RegExp(tp.regex, "i");
    if (reg.test(lowerQuery)) {
      timeframeResult = {
        label: tp.label,
        urgency: tp.urgency,
      };
      break;
    }
  }

  // 4. Extract Budget (CHF / Max / Hourly)
  let budgetResult: ParsedIntent["budget"] = null;

  // Try max budget pattern first (e.g. "within CHF 1500", "under 500")
  const maxMatch = lowerQuery.match(
    /(?:under|below|max(?:imum)?|up to|within|budget of)\s*(?:chf|fr\.?)?\s*(\d[\d,.']*)/i,
  );
  if (maxMatch) {
    const rawVal = maxMatch[1].replace(/['\s,]/g, "");
    const amount = parseFloat(rawVal);
    if (!isNaN(amount)) {
      budgetResult = { amount, type: "max", currency: "CHF" };
    }
  }

  // Try exact CHF pattern if max budget wasn't found
  if (!budgetResult) {
    const exactMatch = lowerQuery.match(/(?:chf|fr\.?)\s*(\d[\d,.']*)/i);
    if (exactMatch) {
      const rawVal = exactMatch[1].replace(/['\s,]/g, "");
      const amount = parseFloat(rawVal);
      if (!isNaN(amount)) {
        budgetResult = { amount, type: "exact", currency: "CHF" };
      }
    }
  }

  // Try hourly pattern
  if (!budgetResult) {
    const hourlyMatch = lowerQuery.match(
      /(\d[\d,.']*)\s*(?:chf|fr\.?)?\s*(?:per|\/)\s*(?:hr|hour|h|stunde)/i,
    );
    if (hourlyMatch) {
      const rawVal = hourlyMatch[1].replace(/['\s,]/g, "");
      const amount = parseFloat(rawVal);
      if (!isNaN(amount)) {
        budgetResult = { amount, type: "hourly", currency: "CHF" };
      }
    }
  }

  // 5. Extract Room Count & Property Type
  const roomMatch = lowerQuery.match(/(\d+)\s*[-]?\s*(?:bed|bedroom|room|zimmer)/i);
  const rooms = roomMatch ? parseInt(roomMatch[1], 10) : undefined;

  let propertyType: string | undefined = undefined;
  if (/\b(house|villa|einfamilienhaus)\b/i.test(lowerQuery)) propertyType = "house";
  else if (/\b(apartment|flat|wohnung)\b/i.test(lowerQuery)) propertyType = "apartment";
  else if (/\b(office|commercial|büro)\b/i.test(lowerQuery)) propertyType = "office";

  // Issue extraction for emergency services
  let issue: string | undefined = undefined;
  if (/\b(leak|leaking|pipe|burst|water)\b/i.test(lowerQuery)) issue = "water leak";
  else if (/\b(clog|clogged|drain|blocked|sink|toilet)\b/i.test(lowerQuery))
    issue = "clogged drain";
  else if (/\b(power|short circuit|outage|blackout|fuse)\b/i.test(lowerQuery))
    issue = "power outage";

  return {
    rawQuery: cleanQuery,
    categoryId: bestCategoryKey,
    categoryLabel: matchedCat ? matchedCat.label : null,
    categorySlug: matchedCat ? matchedCat.slug : null,
    isEmergency,
    timeframe: timeframeResult,
    budget: budgetResult,
    extractedEntities: {
      rooms,
      propertyType,
      issue,
    },
  };
}
