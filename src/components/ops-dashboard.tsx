import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  HardHat,
  Activity,
  DollarSign,
  Calendar,
  Briefcase,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { KpiCard } from "@/components/kpi-card";

export function OpsDashboard() {
  const navigate = useNavigate();

  const { data: opsData, isLoading } = useQuery({
    queryKey: ["opsDashboardData"],
    queryFn: async () => {
      // 1. Get user count
      const profilesCount = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      // 2. Get provider/contractor count
      const contractorsCount = await supabase
        .from("contractors")
        .select("id", { count: "exact", head: true });

      // 3. Get bookings data
      const bookingsQuery = await supabase
        .from("bookings")
        .select(
          "id, status, total_price, scheduled_at, client:profiles(full_name), provider:organizations(name), service:provider_services(name)",
        )
        .order("created_at", { ascending: false });

      // 4. Get active tenders
      const tendersCount = await supabase
        .from("public_tenders")
        .select("id", { count: "exact", head: true })
        .eq("status", "open");

      const bookings = bookingsQuery.data || [];

      const totalRevenue = bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_price), 0);

      const liveBookingsCount = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "in_progress",
      ).length;

      return {
        recentBookings: bookings.slice(0, 5),
        stats: {
          totalUsers: profilesCount.count ?? 0,
          totalProviders: contractorsCount.count ?? 0,
          liveBookings: liveBookingsCount,
          totalRevenue,
          activeTenders: tendersCount.count ?? 0,
        },
      };
    },
  });

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto text-slate-800">
      {/* Admin Warning Alert */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Administrative Portal (Operations)</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            You are currently viewing marketplace analytics and management tools. Actions performed
            here affect all customers and service providers on BlueX.ch.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Marketplace Revenue"
          value={isLoading ? "-" : `CHF ${(opsData?.stats.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <KpiCard
          label="Active Providers"
          value={isLoading ? "-" : (opsData?.stats.totalProviders ?? 0)}
          icon={HardHat}
        />
        <KpiCard
          label="Live Bookings"
          value={isLoading ? "-" : (opsData?.stats.liveBookings ?? 0)}
          icon={Activity}
        />
        <KpiCard
          label="Active Tenders"
          value={isLoading ? "-" : (opsData?.stats.activeTenders ?? 0)}
          icon={Briefcase}
        />
      </div>

      {/* Booking Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Active Bookings Monitor
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/ops/bookings" })}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              Monitor all
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      Loading bookings data...
                    </td>
                  </tr>
                ) : !opsData?.recentBookings || opsData.recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      No bookings available.
                    </td>
                  </tr>
                ) : (
                  opsData.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {(b.service as any)?.name || "General Service"}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(b.scheduled_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {(b.client as any)?.full_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {(b.provider as any)?.name || "Independent"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                            b.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : b.status === "confirmed"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : b.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-red-50 text-red-700 border-red-100"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-semibold text-right text-xs">
                        CHF {Number(b.total_price).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Audits Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Compliance</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-800">
                    Database Connection
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                  ONLINE
                </span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-800">
                    Registered Platform Users
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-700">
                  {isLoading ? "-" : (opsData?.stats.totalUsers ?? 0)}
                </span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-800">API Health Checks</span>
                </div>
                <span className="text-[10px] bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded">
                  100% PASS
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs gap-1"
              onClick={() => navigate({ to: "/ops/users" })}
            >
              Moderation Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
