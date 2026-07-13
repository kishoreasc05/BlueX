import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  HardHat,
  DollarSign,
  Calendar,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreVertical,
  Plus,
  HelpCircle,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Colors for status donuts
const STATUS_COLORS = {
  confirmed: "#3b82f6", // Blue
  pending: "#f59e0b", // Amber
  completed: "#10b981", // Emerald
  cancelled: "#ef4444", // Red
};

export function OpsDashboard() {
  const navigate = useNavigate();

  // 1. Fetch live metrics from database
  const { data: opsData, isLoading } = useQuery({
    queryKey: ["opsMockupDashboardData"],
    queryFn: async () => {
      // Fetch bookings with clients and services
      const bookingsQuery = await supabase
        .from("bookings")
        .select(
          `
          id, 
          status, 
          total_price, 
          scheduled_at, 
          created_at,
          notes,
          client:profiles(full_name, email),
          provider:organizations(name),
          service:provider_services(name)
        `,
        )
        .order("created_at", { ascending: false });

      if (bookingsQuery.error) throw bookingsQuery.error;
      const bookings = (bookingsQuery.data || []) as any[];

      // Fetch profiles
      const profilesQuery = await supabase
        .from("profiles")
        .select("id, role, full_name, email, created_at");

      if (profilesQuery.error) throw profilesQuery.error;
      const profiles = (profilesQuery.data || []) as any[];

      // Fetch provider profiles
      const providersQuery = await supabase.from("provider_profiles").select(`
          user_id,
          verification_status,
          provider_type,
          company_name,
          profile:profiles(full_name, email, created_at)
        `);

      if (providersQuery.error) throw providersQuery.error;
      const providerProfiles = (providersQuery.data || []) as any[];

      // Calculations
      const totalBookings = bookings.length;
      const totalRevenue = bookings
        .filter((b) => b.status === "completed" || b.status === "confirmed")
        .reduce((sum, b) => sum + Number(b.total_price), 0);
      const platformCommission = totalRevenue * 0.15; // 15% platform commission
      const activeProviders = providerProfiles.filter(
        (p) => p.verification_status === "approved",
      ).length;
      const newCustomers = profiles.filter((p) => p.role === "client").length;
      const pendingVerificationsCount = providerProfiles.filter(
        (p) => p.verification_status === "pending_approval",
      ).length;

      // Bookings grouped by status
      const statusCounts = bookings.reduce(
        (acc: any, curr) => {
          const s = curr.status || "pending";
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        },
        { confirmed: 0, pending: 0, completed: 0, cancelled: 0 },
      );

      const statusDonutData = [
        { name: "Confirmed", value: statusCounts.confirmed, color: STATUS_COLORS.confirmed },
        { name: "Pending", value: statusCounts.pending, color: STATUS_COLORS.pending },
        { name: "Completed", value: statusCounts.completed, color: STATUS_COLORS.completed },
        { name: "Cancelled", value: statusCounts.cancelled, color: STATUS_COLORS.cancelled },
      ];

      // Group revenue by date for Line chart (traversing past 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      }).reverse();

      const chartData = last7Days.map((dateStr) => {
        const dayBookings = bookings.filter((b) => b.created_at.startsWith(dateStr));
        const dayRev = dayBookings
          .filter((b) => b.status === "completed" || b.status === "confirmed")
          .reduce((sum, b) => sum + Number(b.total_price), 0);

        const label = new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return { name: label, Revenue: dayRev };
      });

      // Live Activity Feed items
      const recentRegs = profiles.slice(0, 3).map((p) => ({
        type: "registration",
        title: p.role === "provider" ? "Provider registered" : "Customer registered",
        desc: `${p.full_name || "New User"} joined BlueX`,
        time: p.created_at,
      }));

      const recentBookingsActivity = bookings.slice(0, 3).map((b) => {
        const clientObj = Array.isArray(b.client) ? b.client[0] : b.client;
        const serviceObj = Array.isArray(b.service) ? b.service[0] : b.service;
        return {
          type: "booking",
          title: "New booking created",
          desc: `${clientObj?.full_name || "Client"} booked ${serviceObj?.name || "Service"}`,
          time: b.created_at,
        };
      });

      const activityFeed = [...recentRegs, ...recentBookingsActivity]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      // Pending verifications details
      const pendingVerifsList = providerProfiles
        .filter((p) => p.verification_status === "pending_approval")
        .slice(0, 3)
        .map((p: any) => {
          const profileObj = Array.isArray(p.profile) ? p.profile[0] : p.profile;
          return {
            name: p.provider_type === "company" ? p.company_name : profileObj?.full_name,
            type: p.provider_type === "company" ? "Company" : "Private Provider",
            submittedAt: profileObj?.created_at,
          };
        });

      // Normalize recent bookings joined arrays
      const normalizedRecent = bookings.slice(0, 5).map((b) => {
        const clientObj = Array.isArray(b.client) ? b.client[0] : b.client;
        const serviceObj = Array.isArray(b.service) ? b.service[0] : b.service;
        const providerObj = Array.isArray(b.provider) ? b.provider[0] : b.provider;
        return {
          ...b,
          client: clientObj,
          service: serviceObj,
          provider: providerObj,
        };
      });

      return {
        stats: {
          totalBookings,
          totalRevenue,
          platformCommission,
          activeProviders,
          newCustomers,
          pendingVerifications: pendingVerificationsCount,
        },
        statusDonutData,
        chartData,
        activityFeed,
        pendingVerifsList,
        recentBookings: normalizedRecent,
      };
    },
  });

  const stats = opsData?.stats || {
    totalBookings: 0,
    totalRevenue: 0,
    platformCommission: 0,
    activeProviders: 0,
    newCustomers: 0,
    pendingVerifications: 0,
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800 bg-[#f8fafc] -m-6 p-8 min-h-screen">
      {/* ── TOP HEADER ── */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            Good morning, Admin! 👋
          </h1>
          <p className="text-xs text-slate-450 font-semibold mt-0.5">
            Here's what's happening on your marketplace today.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-450" />
            <input
              placeholder="Search anything...          ⌘ K"
              className="pl-9 pr-3 h-9 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-500 rounded-xl hover:bg-slate-100"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-500 rounded-xl hover:bg-slate-100"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>

            <div className="h-9 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-black text-slate-900 leading-tight">Admin</div>
                <div className="text-[10px] text-slate-450 font-bold leading-tight">
                  Super Admin
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── KPI METRICS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Bookings */}
        <div
          onClick={() => navigate({ to: "/ops/bookings" })}
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.totalBookings.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +18.2% vs yesterday
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => navigate({ to: "/payments" })}
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              CHF {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +21.4% vs yesterday
            </div>
          </div>
        </div>

        {/* Platform Commission */}
        <div
          onClick={() => navigate({ to: "/payments" })}
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Platform Commission
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              CHF {stats.platformCommission.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +19.6% vs yesterday
            </div>
          </div>
        </div>

        {/* Active Providers */}
        <div
          onClick={() => navigate({ to: "/ops/users", search: { role: "provider" } as any })}
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Providers
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.activeProviders.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +15.7% vs yesterday
            </div>
          </div>
        </div>

        {/* New Customers */}
        <div
          onClick={() => navigate({ to: "/ops/users", search: { role: "client" } as any })}
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              New Customers
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.newCustomers.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +12.5% vs yesterday
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div
          onClick={() =>
            navigate({ to: "/ops/users", search: { tab: "pending_freelancers" } as any })
          }
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-amber-200 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Verifications
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.pendingVerifications.toLocaleString()}
            </div>
            <div className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-1">
              <TrendingDown className="h-3 w-3" /> -8.3% vs yesterday
            </div>
          </div>
        </div>
      </div>

      {/* ── SECOND ROW: LINE CHART & DONUT CHART & LIVE ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Overview</h2>
            <select className="border border-slate-200 rounded-xl px-3 h-9 text-xs font-bold bg-white text-slate-600 focus:outline-none">
              <option>Revenue</option>
              <option>Bookings</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">
                  Revenue (CHF)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">
                    CHF {stats.totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3.5 w-3.5" /> +21.4%
                  </span>
                </div>
              </div>

              {/* Line chart */}
              <div className="h-56 w-full">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                    Loading overview chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={opsData?.chartData || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `CHF ${v}`}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="Revenue"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 space-y-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider text-center">
                Bookings by Status
              </span>

              {/* Donut Chart */}
              <div className="h-32 w-32 relative flex items-center justify-center">
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-xl font-black text-slate-900">{stats.totalBookings}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Total
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={opsData?.statusDonutData || []}
                      innerRadius={45}
                      outerRadius={55}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(opsData?.statusDonutData || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="w-full grid grid-cols-2 gap-2 text-[10px]">
                {(opsData?.statusDonutData || []).map((entry: any) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-500 font-semibold">{entry.name}</span>
                    <span className="ml-auto font-black text-slate-900">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900">Live Activity</h2>
              <button className="text-[11px] font-bold text-blue-600 hover:underline">
                View all
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {opsData?.activityFeed.map((activity, idx) => (
                <div key={idx} className="flex gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === "booking"
                        ? "bg-blue-50 text-blue-600"
                        : activity.type === "registration"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {activity.type === "booking" ? (
                      <Calendar className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11.5px] font-black text-slate-900 block leading-tight">
                      {activity.title}
                    </span>
                    <span className="text-[10.5px] text-slate-450 font-bold block mt-0.5 leading-tight truncate">
                      {activity.desc}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 shrink-0">
                    {new Date(activity.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 mt-6 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            View all activity →
          </button>
        </div>
      </div>

      {/* ── THIRD ROW: PENDING VERIFICATIONS & TOP SERVICES & ALERTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Verifications Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pending Verifications
              </h3>
              <button
                onClick={() => navigate({ to: "/ops/users" })}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {opsData && opsData.pendingVerifsList.length > 0 ? (
                opsData.pendingVerifsList.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-slate-100">
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {p.name ? p.name[0].toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-black text-slate-800 block leading-tight truncate">
                        {p.name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 block leading-tight">
                        {p.type}
                      </span>
                    </div>
                    <span className="inline-flex px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-wider border border-amber-100">
                      Pending
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-6 font-semibold">
                  No pending accounts
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate({ to: "/ops/users" })}
            className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 mt-4 hover:underline"
          >
            Go to verifications <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Top Services Horizontal Bars */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Top Services (This Month)
              </h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">
                View all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { name: "House Cleaning", value: 342, percentage: "w-[90%]" },
                { name: "Moving & Transport", value: 218, percentage: "w-[65%]" },
                { name: "Plumbing", value: 168, percentage: "w-[50%]" },
                { name: "Electrical", value: 146, percentage: "w-[43%]" },
                { name: "Garden Maintenance", value: 132, percentage: "w-[39%]" },
              ].map((service) => (
                <div key={service.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-650 font-bold">{service.name}</span>
                    <span className="text-slate-900 font-black">{service.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className={`h-full bg-blue-600 rounded-full ${service.percentage}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 mt-4 hover:underline">
            View full report <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Revenue Overview Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Revenue Overview
              </h3>
              <select className="border border-slate-250 rounded-lg px-2 h-7 text-[10px] font-bold bg-white text-slate-600">
                <option>This Month</option>
              </select>
            </div>

            <div className="mt-4 space-y-3 text-[11px]">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-bold">Total Revenue</span>
                <span className="text-slate-900 font-black">
                  CHF {stats.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-bold">Platform Commission</span>
                <span className="text-slate-900 font-black">
                  CHF {stats.platformCommission.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-bold">Provider Payouts</span>
                <span className="text-slate-900 font-black">
                  CHF {(stats.totalRevenue - stats.platformCommission).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 text-red-500 font-bold">
                <span>Refunds</span>
                <span>CHF 438</span>
              </div>
            </div>
          </div>

          <button className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 mt-4 hover:underline">
            View financial report <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Alerts & Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Alerts & Tasks
              </h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">
                View all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  title: "3 providers have expired documents",
                  desc: "Please review and take action.",
                  type: "danger",
                },
                {
                  title: "2 company verifications pending",
                  desc: "Company documents need review.",
                  type: "warning",
                },
                {
                  title: "5 payments failed",
                  desc: "Action required to retry payments.",
                  type: "danger",
                },
                {
                  title: "System update available",
                  desc: "New update v2.4.1 is ready to install.",
                  type: "info",
                },
              ].map((alert, idx) => (
                <div key={idx} className="flex gap-2 text-[10.5px]">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5 text-[8px] font-black ${
                      alert.type === "danger"
                        ? "bg-red-500"
                        : alert.type === "warning"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }`}
                  >
                    !
                  </div>
                  <div>
                    <span className="text-slate-850 font-black block leading-snug">
                      {alert.title}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-bold block mt-0.5 leading-snug">
                      {alert.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOURTH ROW: RECENT BOOKINGS & SUPPORT TICKETS DONUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Recent Bookings</h2>
            <button
              onClick={() => navigate({ to: "/ops/bookings" })}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-450 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400 font-semibold">
                      Loading bookings...
                    </td>
                  </tr>
                ) : opsData && opsData.recentBookings.length > 0 ? (
                  opsData.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-black text-blue-600">
                        #BK-{b.id.substring(0, 5).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {b.service?.name || "General Service"}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {b.client?.full_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {b.provider?.name || "Independent"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">
                        {new Date(b.scheduled_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
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
                      <td className="px-6 py-4 font-black text-slate-900">
                        CHF {Number(b.total_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 rounded hover:bg-slate-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400 font-semibold">
                      No bookings recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Tickets Donut */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Support Overview</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">View all</button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center space-y-5">
            {/* Donut */}
            <div className="h-32 w-32 relative flex items-center justify-center">
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-xl font-black text-slate-900">42</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Tickets
                </span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Open", value: 18, color: "#3b82f6" },
                      { name: "In Progress", value: 12, color: "#f59e0b" },
                      { name: "Waiting", value: 7, color: "#10b981" },
                      { name: "Resolved", value: 5, color: "#ef4444" },
                    ]}
                    innerRadius={45}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      { color: "#3b82f6" },
                      { color: "#f59e0b" },
                      { color: "#10b981" },
                      { color: "#ef4444" },
                    ].map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="w-full space-y-2 text-[10.5px]">
              {[
                { name: "Open", value: 18, percentage: "43%", color: "#3b82f6" },
                { name: "In Progress", value: 12, percentage: "29%", color: "#f59e0b" },
                { name: "Waiting for Reply", value: 7, percentage: "17%", color: "#10b981" },
                { name: "Resolved", value: 5, percentage: "12%", color: "#ef4444" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-500 font-bold">{item.name}</span>
                  <span className="ml-auto font-black text-slate-900">
                    {item.value} ({item.percentage})
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full text-xs font-bold text-blue-600 flex items-center justify-center gap-1 pt-3 border-t border-slate-100 hover:underline">
              Go to support center <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
