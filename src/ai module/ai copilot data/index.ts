import { CopilotKnowledgeRule, ProviderRealData, CantonalBenchmark } from "./copilot.types";
import profileDiagnosticsData from "./profile_diagnostics_rules.json";
import cantonalBenchmarksData from "./cantonal_pricing_benchmarks.json";
import proposalTemplatesData from "./proposal_tender_templates.json";
import swissPayrollData from "./swiss_payroll_compliance.json";
import ocrVerificationData from "./ocr_trust_verification.json";
import providerGrowthData from "./provider_growth_tactics.json";
import disputeInsuranceData from "./dispute_and_insurance_faq.json";
import equipmentMaterialsData from "./equipment_and_materials_guide.json";
import clientCommunicationData from "./swiss_client_communication.json";
import emergencySurchargesData from "./emergency_service_surcharges.json";

export * from "./copilot.types";

/**
 * Calculates dynamic profile health score based on real provider Supabase profile data.
 */
export function calculateRealProfileHealth(provider: ProviderRealData): {
  score: number;
  conversionRate: number;
  metrics: { label: string; value: string; target: string; status: "good" | "warning" | "critical" }[];
} {
  let score = 20; // Base score

  const hasAvatar = !!provider.avatar_url;
  const hasBio = !!(provider.bio && provider.bio.length > 20);
  const hasRate = !!(provider.hourly_rate && provider.hourly_rate > 0);
  const isVerified = !!provider.verified;
  const reviewsCount = provider.stats?.totalReviews || 0;
  const completedJobs = provider.stats?.completedBookingsCount || 0;

  if (hasAvatar) score += 15;
  if (hasBio) score += 10;
  if (hasRate) score += 15;
  if (isVerified) score += 20;
  if (reviewsCount >= 1) score += 10;
  if (reviewsCount >= 5) score += 10;

  const scoreClamped = Math.min(100, Math.max(25, score));
  
  // Calculate conversion rate dynamically based on completed jobs and verified badge
  const conversionRate = isVerified
    ? Math.min(32.5, 12.0 + completedJobs * 1.5 + (reviewsCount * 0.8)).toFixed(1)
    : Math.min(18.4, 6.0 + completedJobs * 0.8).toFixed(1);

  return {
    score: scoreClamped,
    conversionRate: Number(conversionRate),
    metrics: [
      {
        label: "PROFILE HEALTH SCORE",
        value: `${scoreClamped}%`,
        target: "100%",
        status: scoreClamped >= 80 ? "good" : scoreClamped >= 60 ? "warning" : "critical",
      },
      {
        label: "BOOKING CONVERSION",
        value: `${conversionRate}%`,
        target: "15%+",
        status: Number(conversionRate) >= 15 ? "good" : "warning",
      },
    ],
  };
}

/**
 * Main Copilot Engine evaluator using 10+ dataset files and live provider account data.
 */
export function evaluateCopilotQuery(
  query: string,
  provider: ProviderRealData
): {
  title: string;
  summary: string;
  metrics?: any[];
  benchmarks?: CantonalBenchmark[];
  actionPoints?: string[];
  sampleText?: string;
  complianceItems?: any[];
  surcharges?: any[];
  communicationTemplate?: any[];
} {
  const qLower = query.toLowerCase();
  const userCanton = (provider.canton || "ZH").toUpperCase();
  const userRate = provider.hourly_rate || 95;
  const userName = provider.full_name || "Provider";
  const userTrade = provider.trade_category || "Service Professional";

  // 1. Profile Performance & Diagnostics Query
  if (
    qLower.includes("health") ||
    qLower.includes("profile") ||
    qLower.includes("score") ||
    qLower.includes("performance") ||
    qLower.includes("diagnostic")
  ) {
    const health = calculateRealProfileHealth(provider);
    return {
      title: profileDiagnosticsData.rules[0].title,
      summary: `Here is a live diagnostic calculated from your actual BlueX profile (${userName}):`,
      metrics: health.metrics,
      actionPoints: profileDiagnosticsData.rules[0].defaultActionPoints,
    };
  }

  // 2. Pricing & Cantonal Benchmarks Query
  if (
    qLower.includes("price") ||
    qLower.includes("pricing") ||
    qLower.includes("rate") ||
    qLower.includes("hourly") ||
    qLower.includes("canton") ||
    qLower.includes("zurich") ||
    qLower.includes("cost") ||
    qLower.includes("benchmark")
  ) {
    const cantonKey = (cantonalBenchmarksData.benchmarks as any)[userCanton] ? userCanton : "ZH";
    const benchList: CantonalBenchmark[] = (cantonalBenchmarksData.benchmarks as any)[cantonKey] || (cantonalBenchmarksData.benchmarks as any)["DEFAULT"];

    // Evaluate user's rate against recommended median
    const matchedTrade = benchList.find((b) => b.trade.toLowerCase().includes(userTrade.toLowerCase())) || benchList[0];
    const diff = userRate - matchedTrade.avgRateNumber;
    const comparisonNote = diff === 0
      ? `Your rate of CHF ${userRate}/hr matches the recommended median in Canton ${cantonKey}.`
      : diff > 0
      ? `Your rate of CHF ${userRate}/hr is CHF ${diff} above the Canton ${cantonKey} median. Consider offering bundled packages.`
      : `Your rate of CHF ${userRate}/hr is CHF ${Math.abs(diff)} below the Canton ${cantonKey} average. You have headroom to increase your rate by +${Math.round((Math.abs(diff)/userRate)*100)}%.`;

    return {
      title: `💰 Canton ${cantonKey} Market Rate & Pricing Benchmarks`,
      summary: `Comparing your current account rate (CHF ${userRate}/hr) against live market benchmarks in Canton ${cantonKey}:\n\n${comparisonNote}`,
      benchmarks: benchList,
      actionPoints: [
        `💡 **Sweet Spot Strategy**: Setting your rate within 5% of the recommended median in Canton ${cantonKey} maximizes win rate without sacrificing margin.`,
        "📈 **Peak Demand Surcharge**: You can increase your rate by +15% for urgent weekend or same-day bookings."
      ]
    };
  }

  // 3. Winning Proposal / Tender Query
  if (
    qLower.includes("tender") ||
    qLower.includes("proposal") ||
    qLower.includes("bid") ||
    qLower.includes("bidding") ||
    qLower.includes("quote")
  ) {
    const template = proposalTemplatesData.templates[0];
    const estHours = 4;
    const laborTotal = estHours * userRate;
    const materialsEst = 120;
    const grandTotal = laborTotal + materialsEst;

    const populatedProposal = template.sampleTemplate
      .replace("{canton}", userCanton)
      .replace("{estimatedHours}", String(estHours))
      .replace("{hourlyRate}", String(userRate))
      .replace("{laborTotal}", String(laborTotal))
      .replace("{materialsEstimate}", String(materialsEst))
      .replace("{grandTotal}", String(grandTotal))
      .replace("{providerName}", userName)
      .replace("{tradeCategory}", userTrade);

    return {
      title: template.title,
      summary: template.summary,
      sampleText: populatedProposal,
      actionPoints: [
        ...template.actionPoints,
        `📝 **Pre-filled details**: Automatically populated with your real name (${userName}), rate (CHF ${userRate}/hr), and location (${userCanton}).`
      ]
    };
  }

  // 4. Swiss Payroll & Tax Compliance Query
  if (
    qLower.includes("payroll") ||
    qLower.includes("tax") ||
    qLower.includes("ahv") ||
    qLower.includes("uvg") ||
    qLower.includes("social security") ||
    qLower.includes("vat") ||
    qLower.includes("mwst")
  ) {
    const comp = swissPayrollData.compliance[0];
    return {
      title: comp.title,
      summary: comp.summary,
      complianceItems: comp.complianceItems,
      actionPoints: comp.actionPoints
    };
  }

  // 5. OCR & Document Verification Query
  if (
    qLower.includes("ocr") ||
    qLower.includes("verify") ||
    qLower.includes("verification") ||
    qLower.includes("document") ||
    qLower.includes("trust") ||
    qLower.includes("badge")
  ) {
    const ocr = ocrVerificationData.verification[0];
    const isVerified = !!provider.verified;
    return {
      title: ocr.title,
      summary: `Your account verification status: ${isVerified ? "✅ Verified Provider" : "⏳ Pending Document Verification"}.\n\nHow our dynamic OCR multi-factor engine scores uploads:`,
      actionPoints: ocr.actionPoints
    };
  }

  // 6. Emergency & Off-hours Surcharges Query
  if (
    qLower.includes("emergency") ||
    qLower.includes("surcharge") ||
    qLower.includes("night") ||
    qLower.includes("weekend") ||
    qLower.includes("holiday") ||
    qLower.includes("24/7")
  ) {
    const sur = emergencySurchargesData.surcharges[0];
    return {
      title: sur.title,
      summary: sur.summary,
      surcharges: sur.surchargeRules,
      actionPoints: sur.actionPoints
    };
  }

  // 7. Client Communication & Etiquette Query
  if (
    qLower.includes("communication") ||
    qLower.includes("greeting") ||
    qLower.includes("message") ||
    qLower.includes("etiquette") ||
    qLower.includes("german")
  ) {
    const comm = clientCommunicationData.communications[0];
    return {
      title: comm.title,
      summary: comm.summary,
      communicationTemplate: [comm.communicationTemplate],
      actionPoints: comm.actionPoints
    };
  }

  // 8. Equipment & Materials Guide Query
  if (
    qLower.includes("equipment") ||
    qLower.includes("material") ||
    qLower.includes("markup") ||
    qLower.includes("tools") ||
    qLower.includes("waste") ||
    qLower.includes("eco")
  ) {
    const eq = equipmentMaterialsData.guides[0];
    return {
      title: eq.title,
      summary: eq.summary,
      actionPoints: eq.actionPoints
    };
  }

  // 9. Disputes & Insurance Query
  if (
    qLower.includes("dispute") ||
    qLower.includes("insurance") ||
    qLower.includes("liability") ||
    qLower.includes("escrow") ||
    qLower.includes("refund")
  ) {
    const disp = disputeInsuranceData.faq[0];
    return {
      title: disp.title,
      summary: disp.summary,
      actionPoints: disp.actionPoints
    };
  }

  // 10. General Growth Tactics (Fallback)
  const growth = providerGrowthData.tactics[0];
  return {
    title: growth.title,
    summary: `Here is a provider growth strategy customized for your profile (${userName}):`,
    actionPoints: growth.actionPoints
  };
}
