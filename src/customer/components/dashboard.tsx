import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Briefcase,
  Search,
  Clock,
  ArrowRight,
  Zap,
  Droplet,
  Sparkles,
  Leaf,
  Paintbrush,
  Hammer,
  Truck,
  Heart,
  MapPin,
  Wallet,
  Star,
  MessageSquare,
  ChevronRight,
  Shield,
  BadgeCheck,
  Headphones,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/kpi-card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/* ── Service Categories ── */
const CATEGORIES = [
  { name: "Cleaning", slug: "cleaner", icon: Sparkles, color: "text-sky-600", bg: "bg-sky-50" },
  { name: "Plumbing", slug: "plumber", icon: Droplet, color: "text-blue-600", bg: "bg-blue-50" },
  {
    name: "Electrical",
    slug: "electrician",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  { name: "Moving", slug: "movers", icon: Truck, color: "text-rose-600", bg: "bg-rose-50" },
  {
    name: "Gardening",
    slug: "gardener",
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    name: "Painting",
    slug: "painter",
    icon: Paintbrush,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    name: "Carpentry",
    slug: "carpenter",
    icon: Hammer,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  { name: "More", slug: "", icon: MoreHorizontal, color: "text-slate-500", bg: "bg-slate-100" },
];

/* ── Custom chart tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-medium">
        <div className="text-slate-300">{label}</div>
        <div className="font-bold">CHF {payload[0].value}</div>
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   CLIENT DASHBOARD COMPONENT — matches Image 1 with Real Data
   ═══════════════════════════════════════════════════════ */
export function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["clientDashboardData", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Query bookings
      const bookingsQuery = supabase
        .from("bookings")
        .select(
          "id, status, scheduled_at, total_price, provider:organizations(name), service:provider_services(name)",
        )
        .eq("client_id", user!.id)
        .order("scheduled_at", { ascending: true });

      // Query public tenders
      const tendersQuery = supabase
        .from("public_tenders")
        .select("id, title, budget, status, created_at, category:service_categories(name)")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // Query real client reviews to calculate Avg. Rating
      const reviewsQuery = supabase.from("reviews").select("rating").eq("client_id", user!.id);

      // Query real unread message count
      const messagesQuery = supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("receiver_id", user!.id)
        .eq("is_read", false);

      const [bookingsRes, tendersRes, reviewsRes, messagesRes] = await Promise.all([
        bookingsQuery,
        tendersQuery,
        reviewsQuery,
        messagesQuery,
      ]);

      const bookings = bookingsRes.data || [];
      const tenders = tendersRes.data || [];
      const reviews = reviewsRes.data || [];
      const unreadCount = messagesRes.count || 0;

      const spent = bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_price), 0);

      const avgRating =
        reviews.length > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
          : 0;

      // Group completed bookings in past 30 days for Recharts area chart
      const chartMap: Record<string, number> = {};
      // Initialize past 5 intervals to prevent blank chart
      for (let i = 4; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i * 6);
        const label = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
        chartMap[label] = 0;
      }

      bookings
        .filter((b) => b.status === "completed")
        .forEach((b) => {
          const dateStr = new Date(b.scheduled_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });
          chartMap[dateStr] = (chartMap[dateStr] || 0) + Number(b.total_price);
        });

      const chartData = Object.entries(chartMap).map(([date, amount]) => ({ date, amount }));

      // Find the first upcoming booking
      const upcoming = bookings.find(
        (b) =>
          (b.status === "confirmed" || b.status === "pending") &&
          new Date(b.scheduled_at).getTime() >= Date.now(),
      );

      return {
        bookings,
        tenders,
        chartData,
        upcoming,
        stats: {
          totalBookings: bookings.length,
          totalSpent: spent,
          avgRating,
          unreadCount,
        },
      };
    },
  });

  const stats = dashboardData?.stats;
  const bookingCount = stats?.totalBookings ?? 0;
  const totalSpent = stats?.totalSpent ?? 0;
  const avgRating = stats?.avgRating ?? 0;
  const unreadCount = stats?.unreadCount ?? 0;
  const chartData = dashboardData?.chartData || [];

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      {/* ── 1. GREETING ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Good morning, {firstName}
          <span className="inline-block text-2xl">👋</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Find trusted professionals and get things done.
        </p>
      </div>

      {/* ── 2. SEARCH BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              What service do you need?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Where?</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                defaultValue="Zurich, Switzerland"
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">When?</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Select date"
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <Button
            className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20"
            onClick={() => navigate({ to: "/client/search" })}
          >
            Search
          </Button>
        </div>
      </div>

      {/* ── 3. POPULAR SERVICES ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Popular Services</h2>
          <button
            onClick={() => navigate({ to: "/client/search" })}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug || cat.name}
              onClick={() =>
                cat.slug && navigate({ to: "/client/search", search: { q: cat.slug } as any })
              }
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", cat.bg)}>
                <cat.icon className={cn("h-5 w-5", cat.color)} />
              </div>
              <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Activity Overview + Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">Activity Overview</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  This Month ▾
                </span>
              </div>
              {/* 4 KPIs in a row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {[
                  {
                    icon: Briefcase,
                    label: "Bookings",
                    value: bookingCount,
                    change: "Real Stats",
                    up: true,
                    bg: "bg-blue-50",
                    color: "text-blue-600",
                  },
                  {
                    icon: Wallet,
                    label: "Spent",
                    value: `CHF ${totalSpent}`,
                    change: "Real Stats",
                    up: true,
                    bg: "bg-emerald-50",
                    color: "text-emerald-600",
                  },
                  {
                    icon: Star,
                    label: "Avg. Rating",
                    value: avgRating > 0 ? `${avgRating}/5` : "N/A",
                    change: "From Reviews",
                    up: true,
                    bg: "bg-amber-50",
                    color: "text-amber-600",
                  },
                  {
                    icon: MessageSquare,
                    label: "Unread Messages",
                    value: unreadCount,
                    change: "Real-time",
                    up: true,
                    bg: "bg-violet-50",
                    color: "text-violet-600",
                  },
                ].map((kpi) => (
                  <div key={kpi.label} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        kpi.bg,
                      )}
                    >
                      <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 leading-tight">
                        {kpi.value}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{kpi.label}</div>
                      <div className="text-[9px] font-bold text-slate-400 mt-0.5">{kpi.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Area Chart */}
            <div className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    dx={-4}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorAmount)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-base font-bold text-slate-900">Recent Bookings</h3>
              <button
                onClick={() => navigate({ to: "/client/bookings" })}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
              >
                View all
              </button>
            </div>
            <div>
              {isLoading ? (
                <p className="text-sm text-slate-500 text-center py-10">Loading bookings...</p>
              ) : !dashboardData?.bookings || dashboardData.bookings.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="No bookings yet"
                    description="When you book services, they will appear here."
                    icon={Calendar}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {dashboardData.bookings.slice(0, 4).map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate({ to: "/client/bookings" })}
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                        🔧
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {(booking.service as any)?.name || "General Service"}
                        </div>
                        <div className="text-xs text-slate-400">
                          by {(booking.provider as any)?.name || "Provider"}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md",
                            booking.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-blue-50 text-blue-600",
                          )}
                        >
                          {booking.status}
                        </span>
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(booking.scheduled_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-800 shrink-0">
                        CHF {Number(booking.total_price).toFixed(0)}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Upcoming Booking (only shown if there is one) */}
          {dashboardData?.upcoming ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Upcoming Booking</h3>
                <button
                  onClick={() => navigate({ to: "/client/bookings" })}
                  className="text-blue-600 text-xs font-semibold hover:text-blue-700"
                >
                  View all
                </button>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  <AvatarImage src="https://i.pravatar.cc/48?u=upcoming" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900">
                    {(dashboardData.upcoming.service as any)?.name || "General Service"}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    by {(dashboardData.upcoming.provider as any)?.name || "Provider"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(dashboardData.upcoming.scheduled_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(dashboardData.upcoming.scheduled_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {dashboardData.upcoming.status}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Emergency 24/7 */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-20">
              <AlertTriangle className="h-16 w-16 text-red-400" />
            </div>
            <div className="relative z-10">
              <div className="text-xs text-slate-300 font-medium">Need immediate help?</div>
              <div className="text-base font-bold mt-1">24/7 Emergency Service</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect with available pros in <span className="text-white font-bold">minutes</span>
              </p>
              <button className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors shadow-lg shadow-red-500/25">
                Request Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. TRUST BANNER ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-blue-600/15">
        <div className="flex items-center gap-4 md:flex-1">
          <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Why choose BlueX.ch?</div>
            <div className="text-sm text-blue-100 mt-0.5">
              All professionals are verified, reviewed, and committed to quality service.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          {[
            { icon: BadgeCheck, label: "Verified", sub: "Professionals" },
            { icon: Shield, label: "Secure", sub: "Payments" },
            { icon: Star, label: "Satisfaction", sub: "Guarantee" },
            { icon: Headphones, label: "24/7", sub: "Support" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                <item.icon className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{item.label}</div>
                <div className="text-[10px] text-blue-200">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
