import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/app-shell";
import {
  Sparkles,
  Send,
  Bot,
  TrendingUp,
  DollarSign,
  Award,
  FileText,
  ShieldCheck,
  Zap,
  Copy,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  evaluateCopilotQuery,
  ProviderRealData,
  CantonalBenchmark,
} from "@/ai module/ai copilot data";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  component: AiCoachPage,
});

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  title?: string;
  metrics?: { label: string; value: string; target?: string; status?: string }[];
  benchmarks?: CantonalBenchmark[];
  actionPoints?: string[];
  sampleText?: string;
  complianceItems?: {
    code: string;
    title: string;
    percentageOrRule: string;
    description: string;
    mandatory: boolean;
  }[];
  surcharges?: {
    type: string;
    timeframe: string;
    surchargeMultiplier: string;
    minCalloutFeeCHF: number;
    description: string;
  }[];
  communicationTemplate?: {
    language: string;
    tone: string;
    greeting: string;
    scopeConfirmation: string;
    closing: string;
  }[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: TrendingUp,
    label: "Analyze my profile performance & health score",
    query: "Analyze my profile performance and health score",
  },
  {
    icon: DollarSign,
    label: "Check if my hourly rate is competitive in Zurich",
    query: "Check if my hourly rate is competitive in Canton Zurich",
  },
  {
    icon: FileText,
    label: "Generate a winning proposal for a public tender",
    query: "Generate a winning proposal draft for a public tender",
  },
  {
    icon: ShieldCheck,
    label: "Explain Swiss AHV & UVG payroll automation",
    query: "Explain BlueX Swiss AHV & UVG payroll automation",
  },
  {
    icon: PhoneCall,
    label: "Night & weekend emergency surcharge rules",
    query: "What are the night and weekend emergency surcharge rules in Switzerland?",
  },
  {
    icon: Award,
    label: "How does dynamic OCR auto-verification work?",
    query: "How does dynamic OCR document auto-verification work?",
  },
  {
    icon: MessageSquare,
    label: "Show Swiss client greeting templates",
    query: "Show professional Swiss client greeting and communication templates",
  },
  {
    icon: Wrench,
    label: "Swiss equipment markup & eco disposal rules",
    query: "What are the rules for equipment material markup and waste disposal in Switzerland?",
  },
];

function AiCoachPage() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Query Real Provider Profile Data from Supabase
  const { data: providerProfile } = useQuery({
    queryKey: ["aiCoachProviderProfile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  // Query Real Provider Bookings Count from Supabase
  const { data: bookingsCount } = useQuery({
    queryKey: ["aiCoachBookingsCount", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", user!.id);
      return count || 0;
    },
  });

  const providerName =
    user?.user_metadata?.full_name || providerProfile?.company_name || "Provider";

  // Construct Real Provider Data Object for Copilot Engine
  const realProviderData: ProviderRealData = {
    id: user?.id,
    full_name: providerName,
    email: user?.email,
    hourly_rate: providerProfile?.hourly_rate || 95,
    trade_category: providerProfile?.category || "Plumbing & Heating",
    bio: providerProfile?.bio || "",
    canton: providerProfile?.canton || "ZH",
    address: providerProfile?.address || "Zürich, Switzerland",
    verified: providerProfile?.verified || false,
    avatar_url: user?.user_metadata?.avatar_url || providerProfile?.avatar_url,
    stats: {
      healthScore: 85,
      bookingConversion: 18.4,
      completedBookingsCount: bookingsCount || 0,
      averageRating: providerProfile?.rating || 5.0,
      totalReviews: providerProfile?.review_count || 0,
    },
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: `Grüezi ${providerName}! I am your BlueX AI Business Coach. I analyze your live profile data against authentic Swiss market benchmarks (26 Cantons) — to help you optimize prices, double booking conversion, and win public tenders.`,
      title: "🚀 Welcome to BlueX AI Business Coach",
      actionPoints: [
        "📊 Ask me to analyze your profile health score & conversion rate.",
        "💰 Compare your rate (CHF " +
          (providerProfile?.hourly_rate || 95) +
          "/hr) against Canton " +
          (providerProfile?.canton || "ZH") +
          " market benchmarks.",
        "📝 Draft personalized winning bid responses for public tenders.",
        "🇨🇭 Review Swiss social security (AHV/UVG) & 8.1% MwSt invoicing rules.",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Evaluate query using Copilot Knowledge Engine & Real Provider Data
    setTimeout(() => {
      const evaluation = evaluateCopilotQuery(query, realProviderData);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        title: evaluation.title,
        text: evaluation.summary,
        metrics: evaluation.metrics,
        benchmarks: evaluation.benchmarks,
        actionPoints: evaluation.actionPoints,
        sampleText: evaluation.sampleText,
        complianceItems: evaluation.complianceItems,
        surcharges: evaluation.surcharges,
        communicationTemplate: evaluation.communicationTemplate,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(str);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-[1200px] mx-auto pb-6 space-y-4">
      {/* ── HEADER ── */}
      <PageHeader
        title={
          <div className="flex items-center gap-2.5 text-slate-900 font-black tracking-tight text-2xl">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>AI Business Coach</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-widest">
              Swiss Market Intelligence
            </span>
          </div>
        }
        description="Rule-based provider growth advisor powered by live account data & 26 Swiss cantonal market datasets."
      />

      {/* ── MAIN CONTAINER ── */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
        {/* ── MESSAGES FEED ── */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 bg-slate-50/40">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 mt-1">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-5 space-y-4 shadow-sm text-sm ${
                    isBot
                      ? "bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm"
                      : "bg-indigo-600 text-white rounded-tr-sm"
                  }`}
                >
                  {/* Header title if bot */}
                  {isBot && msg.title && (
                    <div className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span>{msg.title}</span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Message body */}
                  <p className="leading-relaxed font-medium whitespace-pre-line">{msg.text}</p>

                  {/* Render Metrics Badges */}
                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      {msg.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl space-y-1"
                        >
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {m.label}
                          </div>
                          <div className="text-lg font-extrabold text-slate-900 flex items-baseline gap-1.5">
                            <span>{m.value}</span>
                            {m.target && (
                              <span className="text-[10px] text-emerald-600 font-bold">
                                (Target {m.target})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Pricing Benchmarks Table */}
                  {msg.benchmarks && msg.benchmarks.length > 0 && (
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                            <th className="p-2.5 rounded-l-lg">Trade</th>
                            <th className="p-2.5">Canton Market Range</th>
                            <th className="p-2.5 rounded-r-lg">Recommended Median</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {msg.benchmarks.map((b, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="p-2.5 font-bold text-slate-800">{b.trade}</td>
                              <td className="p-2.5 text-slate-500 font-mono">{b.marketRange}</td>
                              <td className="p-2.5 text-indigo-600 font-bold font-mono">
                                {b.recommended}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Render Copyable Tender Proposal Box */}
                  {msg.sampleText && (
                    <div className="pt-2">
                      <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs relative group border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans tracking-wider border-b border-slate-800 pb-2">
                          <span>Swiss Bid Response Proposal Draft</span>
                          <button
                            onClick={() => copyToClipboard(msg.sampleText!)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy Proposal</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono leading-relaxed text-slate-200">
                          {msg.sampleText}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Render Swiss Compliance Items */}
                  {msg.complianceItems && msg.complianceItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {msg.complianceItems.map((ci, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 text-xs">{ci.code}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                              {ci.percentageOrRule}
                            </span>
                          </div>
                          <div className="font-bold text-slate-800 text-xs">{ci.title}</div>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            {ci.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Emergency Surcharges Table */}
                  {msg.surcharges && msg.surcharges.length > 0 && (
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-amber-50 text-amber-900 font-bold border-b border-amber-200">
                            <th className="p-2.5 rounded-l-lg">Surcharge Type</th>
                            <th className="p-2.5">Timeframe</th>
                            <th className="p-2.5">Multiplier</th>
                            <th className="p-2.5 rounded-r-lg">Min Callout Fee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {msg.surcharges.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="p-2.5 font-bold text-slate-800">{s.type}</td>
                              <td className="p-2.5 text-slate-500">{s.timeframe}</td>
                              <td className="p-2.5 text-emerald-600 font-bold font-mono">
                                {s.surchargeMultiplier}
                              </td>
                              <td className="p-2.5 font-bold font-mono text-slate-900">
                                CHF {s.minCalloutFeeCHF}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Render Client Communication Template */}
                  {msg.communicationTemplate && msg.communicationTemplate.length > 0 && (
                    <div className="pt-2">
                      {msg.communicationTemplate.map((ct, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between text-slate-400 text-[10px] font-sans border-b border-slate-800 pb-2">
                            <span>
                              {ct.language} • {ct.tone}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `${ct.greeting}\n\n${ct.scopeConfirmation}\n\n${ct.closing}`,
                                )
                              }
                              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="h-3 w-3" />
                              <span>Copy All</span>
                            </button>
                          </div>
                          <div className="space-y-2 text-slate-200">
                            <p className="font-bold text-indigo-300">{ct.greeting}</p>
                            <p>{ct.scopeConfirmation}</p>
                            <p className="whitespace-pre-line text-slate-400">{ct.closing}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Action Points Checklist */}
                  {msg.actionPoints && msg.actionPoints.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {msg.actionPoints.map((ap, idx) => (
                        <div
                          key={idx}
                          className="bg-indigo-50/50 border border-indigo-100/80 p-3 rounded-xl text-xs font-medium text-slate-700 leading-relaxed relative group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span>{ap}</span>
                            <button
                              onClick={() => copyToClipboard(ap)}
                              className="text-slate-400 hover:text-indigo-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy text"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Interactive Prompt Buttons inside Welcome Message */}
                  {msg.id === "welcome-1" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                      {[
                        {
                          label: "📊 Analyze my live profile health & conversion rate",
                          query: "Analyze my profile performance and health score",
                        },
                        {
                          label: "💰 Compare my hourly rate with canton market average",
                          query: "Check if my hourly rate is competitive in Canton Zurich",
                        },
                        {
                          label: "🚀 How to get 40% more client bookings",
                          query: "How can I get 40% more client bookings on BlueX?",
                        },
                        {
                          label: "📝 Draft a winning proposal for public tenders",
                          query: "Generate a winning proposal draft for a public tender",
                        },
                      ].map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt.query)}
                          className="text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs hover:text-indigo-700 flex items-center justify-between group"
                        >
                          <span>{prompt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!isBot && (
                    <div className="text-[10px] text-indigo-200 text-right font-mono">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="h-9 w-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3.5 items-center text-slate-400 text-xs font-medium pl-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── QUICK PROMPTS CHIPS ── */}
        <div className="p-3 border-t border-slate-200/80 bg-white space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Suggested Coaching Topics:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.query)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-xs font-semibold text-slate-700 transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  <Icon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── INPUT BAR ── */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center"
          >
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AI Coach about rates, tenders, profile health, or Swiss payroll..."
              className="pr-12 py-6 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-500 text-sm font-medium bg-white"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
