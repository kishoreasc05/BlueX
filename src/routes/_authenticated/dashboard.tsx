import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  Bot,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MoreHorizontal,
  Lightbulb,
  Zap,
  BarChart3,
  MessageSquare,
  Timer,
  Check,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ClientDashboard } from "@/customer/components/dashboard";
import { OpsDashboard } from "@/admin/components/dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

/* ── Mock data for Provider Dashboard ── */
const todaysJobs = [
  {
    time: "09:00 AM",
    countdown: "In 45 min",
    title: "Bathroom Plumbing Fix",
    address: "Seestrasse 123, 8002 Zurich",
    category: "Residential",
    categoryColor: "bg-blue-50 text-blue-600",
    amount: "CHF 150",
    status: "Confirmed",
  },
  {
    time: "01:00 PM",
    countdown: "In 4h 45m",
    title: "Kitchen Pipe Installation",
    address: "Weinbergstrasse 45, 8001 Zurich",
    category: "Installation",
    categoryColor: "bg-violet-50 text-violet-600",
    amount: "CHF 220",
    status: "Confirmed",
  },
  {
    time: "03:30 PM",
    countdown: "In 7h 15m",
    title: "Water Heater Repair",
    address: "Badenerstrasse 178, 8004 Zurich",
    category: "Repair",
    categoryColor: "bg-amber-50 text-amber-600",
    amount: "CHF 180",
    status: "Confirmed",
  },
];

const scheduleBlocks = [
  { name: "Bathroom\nPlumbing Fix", time: "09:00 – 11:00", startHour: 9, endHour: 11, color: "bg-blue-100 border-blue-300 text-blue-700" },
  { name: "Kitchen Pipe\nInstallation", time: "01:00 – 03:00", startHour: 13, endHour: 15, color: "bg-violet-100 border-violet-300 text-violet-700" },
  { name: "Water Heater Repair", time: "03:30 – 05:00", startHour: 15.5, endHour: 17, color: "bg-amber-100 border-amber-300 text-amber-700" },
];

const pendingRequests = [
  {
    when: "Today",
    time: "10:30 AM",
    title: "Unclog Drain",
    address: "Kolibristrasse 90, 8003 Zurich",
    amount: "CHF 120",
    badge: "Emergency",
    badgeColor: "bg-red-50 text-red-600",
  },
  {
    when: "Tomorrow",
    time: "11:00 AM",
    title: "New Tap Installation",
    address: "Birmendorferstrasse 55, 8004 Zurich",
    amount: "CHF 160",
    badge: "Installation",
    badgeColor: "bg-violet-50 text-violet-600",
  },
];

const upcomingJobs = [
  { day: "THU", date: "8 MAY", title: "Shower Installation", address: "Zollikerstrasse 123, 8008 Zurich", amount: "CHF 250", time: "10:00 AM" },
  { day: "FRI", date: "9 MAY", title: "Pipe Leakage Fix", address: "Hönggerstrasse 45, 8037 Zurich", amount: "CHF 130", time: "02:00 PM" },
  { day: "SAT", date: "10 MAY", title: "Bathroom Renovation", address: "Albisstrasse 78, 8134 Adliswil", amount: "CHF 480", time: "09:00 AM" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = [4, 5, 6, 7, 8, 9, 10];
const todayIdx = 2; // Wednesday = index 2
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

/* ═══════════════════════════════════════════════════════
   DASHBOARD ROUTE
   ═══════════════════════════════════════════════════════ */
function Dashboard() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const navigate = useNavigate();
  const activePortal = user?.user_metadata?.portal_role || "client";
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  /* ── Client / Ops portals ── */
  if (activePortal === "client") {
    return <ClientDashboard />;
  }
  if (activePortal === "operations") {
    return <OpsDashboard />;
  }

  /* ═══════════════════════════════════════════════════════
     PROVIDER DASHBOARD — matches Image 2
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      {/* ── 1. GREETING ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Good morning, {firstName}!
          <span className="inline-block text-2xl">👋</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          You have 3 jobs today and 2 pending requests.
        </p>
      </div>

      {/* ── 2. TODAY'S OVERVIEW — 4 KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: "Jobs Today", value: "3", link: "View all →", bg: "bg-blue-50", color: "text-blue-600" },
          { icon: CheckCircle2, label: "Pending Requests", value: "2", link: "View all →", bg: "bg-emerald-50", color: "text-emerald-600" },
          { icon: DollarSign, label: "Expected Earnings", value: "CHF 320", link: "View details →", bg: "bg-amber-50", color: "text-amber-600" },
          { icon: Star, label: "Average Rating", value: "4.8", link: "View reviews →", bg: "bg-violet-50", color: "text-violet-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", kpi.bg)}>
                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</div>
            <button className="text-xs text-blue-600 font-semibold mt-2 hover:text-blue-700 flex items-center gap-0.5">
              {kpi.link}
            </button>
          </div>
        ))}
      </div>

      {/* ── 3. MAIN GRID (3 columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-6">
        {/* LEFT: Today's Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-0">
            <h3 className="text-base font-bold text-slate-900">Today's Jobs</h3>
            <button className="text-blue-600 text-xs font-semibold hover:text-blue-700">View calendar</button>
          </div>
          <div className="p-5 space-y-4">
            {todaysJobs.map((job, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 last:pb-0 last:border-0 border-b border-slate-100">
                {/* Time column */}
                <div className="shrink-0 text-right w-16">
                  <div className="text-sm font-bold text-slate-900">{job.time}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{job.countdown}</div>
                </div>
                {/* Dot connector */}
                <div className="flex flex-col items-center mt-1.5 shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                  {i < todaysJobs.length - 1 && <div className="w-px h-full bg-slate-200 mt-1 min-h-[40px]" />}
                </div>
                {/* Job info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.address}
                      </div>
                      <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1.5", job.categoryColor)}>
                        {job.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">{job.amount}</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4">
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View all jobs <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CENTER: Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="text-base font-bold text-slate-900">Schedule</h3>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-slate-100"><ChevronLeft className="h-4 w-4 text-slate-400" /></button>
              <span className="text-sm font-semibold text-slate-700">May 2026</span>
              <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="h-4 w-4 text-slate-400" /></button>
              <button className="ml-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Today</button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0 px-5 pb-2">
            {weekDays.map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-[10px] font-medium text-slate-400 uppercase">{day}</div>
                <div className={cn(
                  "text-sm font-semibold mt-1 w-8 h-8 flex items-center justify-center mx-auto rounded-full",
                  i === todayIdx ? "bg-blue-600 text-white" : "text-slate-600"
                )}>
                  {weekDates[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots grid */}
          <div className="relative px-5 pb-4 overflow-y-auto max-h-[320px]">
            <div className="relative" style={{ height: `${hours.length * 48}px` }}>
              {/* Hour lines */}
              {hours.map((hour, i) => (
                <div key={hour} className="absolute left-0 right-0 flex items-start" style={{ top: `${i * 48}px` }}>
                  <span className="text-[10px] text-slate-400 font-medium w-12 shrink-0 -mt-1.5">
                    {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                  </span>
                  <div className="flex-1 border-t border-slate-100" />
                </div>
              ))}

              {/* Job blocks */}
              {scheduleBlocks.map((block, i) => {
                const top = (block.startHour - 8) * 48;
                const height = (block.endHour - block.startHour) * 48;
                return (
                  <div
                    key={i}
                    className={cn("absolute left-14 right-2 rounded-lg border px-2.5 py-1.5 cursor-pointer hover:opacity-90 transition-opacity", block.color)}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className="text-xs font-semibold whitespace-pre-line leading-tight">{block.name}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{block.time}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-4">
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View full calendar <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Earnings Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Earnings Overview</h3>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">This Month ▾</span>
            </div>
            <div className="mb-1">
              <div className="text-xs text-slate-400">Total Earnings</div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">CHF 4,680</span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                  +18% vs last month
                </span>
              </div>
            </div>
            {/* Earnings bar */}
            <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-blue-600 rounded-l-full" style={{ width: "84%" }} />
              <div className="h-full bg-amber-400 rounded-r-full" style={{ width: "16%" }} />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <div>
                <span className="font-bold text-slate-700">CHF 3,950</span>
                <span className="text-slate-400 ml-1">Completed</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">CHF 730</span>
                <span className="text-slate-400 ml-1">Upcoming</span>
              </div>
            </div>
            <button className="mt-4 w-full text-blue-600 text-xs font-semibold py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors flex items-center justify-center gap-1">
              View Earnings Breakdown <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* AI Business Coach */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">AI Business Coach</h3>
                <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100">Beta</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
            </div>

            {/* Insight card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-xs font-bold text-slate-700">Insight for you</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                You're booked 18% more on weekends. Consider increasing your weekend rates by 10-15%.
              </p>
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                View Recommendation
              </button>
            </div>

            {/* Quick links */}
            <div className="space-y-0.5">
              {[
                { label: "Improve Profile", sub: "Get more bookings" },
                { label: "Pricing Insights", sub: "Optimize your rates" },
                { label: "Business Tips", sub: "Grow your business" },
              ].map((link) => (
                <button key={link.label} className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{link.label}</div>
                    <div className="text-[10px] text-slate-400">{link.sub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>

            <button className="mt-2 text-blue-600 text-xs font-semibold hover:text-blue-700 flex items-center gap-1">
              Open AI Coach <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM ROW (3 columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900">Performance</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">This Month ▾</span>
          </div>
          <div className="space-y-4">
            {[
              { icon: Briefcase, label: "Jobs Completed", value: "28", change: "+22%", up: true, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: MessageSquare, label: "Response Rate", value: "96%", change: "+8%", up: true, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: Timer, label: "On-time Rate", value: "98%", change: "+5%", up: true, color: "text-violet-600", bg: "bg-violet-50" },
              { icon: Star, label: "Customer Satisfaction", value: "4.8/5", change: "+0.3", up: true, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center gap-3">
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", metric.bg)}>
                  <metric.icon className={cn("h-4 w-4", metric.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-400 font-medium">{metric.label}</div>
                </div>
                <div className="text-sm font-bold text-slate-900">{metric.value}</div>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  metric.up ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                )}>
                  ▲ {metric.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-0">
            <h3 className="text-base font-bold text-slate-900">Pending Requests</h3>
            <button className="text-blue-600 text-xs font-semibold hover:text-blue-700">View all</button>
          </div>
          <div className="p-5 space-y-4">
            {pendingRequests.map((req, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b border-slate-100">
                <div className="shrink-0">
                  <div className="text-xs font-bold text-slate-500">{req.when}</div>
                  <div className="text-[10px] text-slate-400">{req.time}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">{req.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {req.address}
                  </div>
                  <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1.5", req.badgeColor)}>
                    {req.badge}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 shrink-0">{req.amount}</div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </button>
                  <button className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4">
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View all requests <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Upcoming Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-0">
            <h3 className="text-base font-bold text-slate-900">Upcoming Jobs</h3>
          </div>
          <div className="p-5 space-y-4">
            {upcomingJobs.map((job, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b border-slate-100">
                <div className="shrink-0 text-center w-10">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">{job.day}</div>
                  <div className="text-[10px] text-slate-400">{job.date}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">{job.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{job.address}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900">{job.amount}</div>
                  <div className="text-[10px] text-slate-400">{job.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4">
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View full schedule <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
