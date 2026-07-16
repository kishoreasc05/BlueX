import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  Star,
  Users,
  Smile,
  Zap,
  TrendingUp,
  MapPin,
  Check,
  X,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-medium">
        <div className="text-slate-300">{label}</div>
        <div className="font-bold">CHF {payload[0].value.toLocaleString("en-CH")}</div>
      </div>
    );
  }
  return null;
}

interface CompanyDashboardProps {
  profile: any;
  bookings: any[];
  bookingsLoading: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  acceptPending: boolean;
  declinePending: boolean;
}

export function CompanyDashboard({
  profile,
  bookings = [],
  bookingsLoading,
  onAccept,
  onDecline,
  acceptPending,
  declinePending,
}: CompanyDashboardProps) {
  const { activeId } = useActiveOrg();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query organization members (employees)
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["companyEmployees", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_members")
        .select("id, role, user_id, profile:profiles(id, full_name, email)")
        .eq("organization_id", activeId!);
      if (error) throw error;
      return data || [];
    },
  });

  // KPI Calculations
  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeJobs = bookings.filter((b) => b.status === "confirmed" || b.status === "in_progress");
  const completedJobs = bookings.filter((b) => b.status === "completed");
  
  const monthlyRevenue = completedJobs.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
  const pendingPayouts = activeJobs.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
  const avgRating = "4.9";
  const customerSatisfaction = "98%";
  const responseRate = "95%";

  // Group revenue for the chart
  const chartMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    chartMap[label] = 0;
  }

  completedJobs.forEach((b: any) => {
    const dateStr = new Date(b.scheduled_at).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (chartMap[dateStr] !== undefined) {
      chartMap[dateStr] += Number(b.total_price || 0);
    }
  });

  const chartData = Object.entries(chartMap).map(([date, amount]) => ({ date, amount }));

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🏢 {profile?.company_name || "Company Dashboard"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Overview of your business operations, employees, and client bookings.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Briefcase,
            label: "Active Jobs",
            value: activeJobs.length,
            bg: "bg-blue-50/60 text-blue-600",
            link: "/jobs",
            border: "hover:border-blue-200",
          },
          {
            icon: Clock,
            label: "Pending Bookings",
            value: pendingRequests.length,
            bg: "bg-amber-50/60 text-amber-600",
            link: "/bookings",
            border: "hover:border-amber-200",
          },
          {
            icon: DollarSign,
            label: "Monthly Revenue",
            value: `CHF ${monthlyRevenue.toLocaleString("en-CH")}`,
            bg: "bg-emerald-50/60 text-emerald-600",
            link: "/payments",
            border: "hover:border-emerald-200",
          },
          {
            icon: Users,
            label: "Active Employees",
            value: employees.length,
            bg: "bg-violet-50/60 text-violet-600",
            link: "/organizations/members",
            border: "hover:border-violet-200",
          },
          {
            icon: DollarSign,
            label: "Pending Payouts",
            value: `CHF ${pendingPayouts.toLocaleString("en-CH")}`,
            bg: "bg-teal-50/60 text-teal-600",
            link: "/payments",
            border: "hover:border-teal-200",
          },
          {
            icon: Star,
            label: "Average Rating",
            value: avgRating,
            bg: "bg-purple-50/60 text-purple-600",
            link: "/settings",
            border: "hover:border-purple-200",
          },
          {
            icon: Smile,
            label: "Customer Satisfaction",
            value: customerSatisfaction,
            bg: "bg-pink-50/60 text-pink-600",
            link: "/settings",
            border: "hover:border-pink-200",
          },
          {
            icon: Zap,
            label: "Response Rate",
            value: responseRate,
            bg: "bg-rose-50/60 text-rose-600",
            link: "/settings",
            border: "hover:border-rose-200",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            onClick={() => navigate({ to: kpi.link as any })}
            className={cn(
              "bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[115px] group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
              kpi.border,
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", kpi.bg)}>
                <kpi.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                Manage
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-400">{kpi.label}</div>
              <div className="text-xl font-black text-slate-900 mt-1 leading-none">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Revenue History</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Monthly business revenue generated via completed gigs.
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                Last 6 Months
              </span>
            </div>
            <div className="h-[220px] w-full mt-4 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompanyRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `CHF ${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorCompanyRevenue)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Booking Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-950">Pending Booking Requests</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                New incoming requests. Accept them to assign to your team members.
              </p>
            </div>
            <div className="p-2">
              {bookingsLoading ? (
                <div className="text-slate-400 text-xs text-center py-10">Loading requests...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No pending customer requests.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {req.client_profile?.full_name || "Client Booking"}
                          </span>
                          <span className="bg-blue-50 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-blue-100 tracking-wider">
                            NEW REQUEST
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold flex flex-wrap gap-x-4 gap-y-1">
                          <span>📅 Date: {req.date}</span>
                          <span>⏰ Time: {req.time || "Flexible"}</span>
                        </div>
                        {req.notes && (
                          <p className="text-[11px] text-slate-400 font-medium italic mt-1">
                            "{req.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0">
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">
                            Price
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            CHF {req.total_price}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => onDecline(req.id)}
                            disabled={declinePending || acceptPending}
                            className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-650 text-[10px] font-bold rounded-xl cursor-pointer h-8 px-3"
                          >
                            Decline
                          </Button>
                          <Button
                            onClick={() => onAccept(req.id)}
                            disabled={declinePending || acceptPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl cursor-pointer h-8 px-4"
                          >
                            Accept & Assign
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar info) */}
        <div className="space-y-6">
          {/* Employee Directory Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950">Team Directory</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/organizations/members" })}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 p-0 h-auto"
              >
                Manage Employees
              </Button>
            </div>
            
            <div className="space-y-3">
              {employeesLoading ? (
                <p className="text-slate-400 text-xs text-center">Loading team...</p>
              ) : employees.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No employees added yet.
                </div>
              ) : (
                employees.slice(0, 4).map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 text-xs uppercase">
                        {member.profile?.full_name?.charAt(0) || "E"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {member.profile?.full_name}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize font-semibold">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Business Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600" /> Company Responsibilities
            </h3>
            <div className="text-[11px] text-slate-500 leading-relaxed space-y-2.5 font-medium">
              <p>
                As a registered business on BlueX, you are solely responsible for:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Employee salaries & social security contributions</li>
                <li>VAT reporting and accounting filings</li>
                <li>Company and employee liability insurances</li>
              </ul>
              <p className="text-slate-400 italic">
                BlueX operates as a booking agent and payouts flow directly to your business Stripe Connect bank account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
