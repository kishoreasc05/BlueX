export interface DiagnosticMetric {
  label: string;
  value: string;
  target?: string;
  status?: "good" | "warning" | "critical";
}

export interface CantonalBenchmark {
  trade: string;
  canton: string;
  marketRange: string;
  recommended: string;
  avgRateNumber: number;
}

export interface TenderProposalTemplate {
  id: string;
  title: string;
  category: string;
  structure: string[];
  sampleText: string;
  disclaimers: string[];
}

export interface ComplianceItem {
  code: string;
  title: string;
  percentageOrRule: string;
  description: string;
  mandatory: boolean;
}

export interface SurchargeRule {
  type: string;
  timeframe: string;
  surchargeMultiplier: string;
  minCalloutFeeCHF: number;
  description: string;
}

export interface ClientGreetingTemplate {
  language: string;
  tone: string;
  greeting: string;
  scopeConfirmation: string;
  closing: string;
}

export interface CopilotKnowledgeRule {
  id: string;
  category: "diagnostics" | "pricing" | "growth" | "tenders" | "compliance" | "verification" | "disputes" | "equipment" | "communication" | "emergency";
  keywords: string[];
  title: string;
  summary: string;
  metrics?: DiagnosticMetric[];
  benchmarks?: CantonalBenchmark[];
  actionPoints?: string[];
  proposalTemplate?: TenderProposalTemplate;
  complianceItems?: ComplianceItem[];
  surcharges?: SurchargeRule[];
  communicationTemplate?: ClientGreetingTemplate;
}

export interface ProviderRealData {
  id?: string;
  full_name?: string;
  email?: string;
  hourly_rate?: number;
  trade_category?: string;
  bio?: string;
  canton?: string;
  address?: string;
  verified?: boolean;
  avatar_url?: string;
  documents_status?: {
    id_card?: boolean;
    trade_license?: boolean;
    ahv_cert?: boolean;
  };
  stats?: {
    healthScore?: number;
    bookingConversion?: number;
    completedBookingsCount?: number;
    averageRating?: number;
    totalReviews?: number;
    totalEarningsCHF?: number;
  };
}
