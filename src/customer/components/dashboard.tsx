import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { EmergencyDialog } from "./emergency-dialog";
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
  MoreVertical,
  Plus,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/kpi-card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/* ── Service Categories ── */
const CATEGORIES = [
  {
    name: "Cleaning",
    slug: "cleaner",
    icon: Sparkles,
    color: "text-sky-600",
    bg: "bg-sky-50",
    count: "120+ providers",
  },
  {
    name: "Plumbing",
    slug: "plumber",
    icon: Droplet,
    color: "text-blue-600",
    bg: "bg-blue-50",
    count: "80+ providers",
  },
  {
    name: "Electrical",
    slug: "electrician",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    count: "75+ providers",
  },
  {
    name: "Garden & Outdoor",
    slug: "gardener",
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    count: "60+ providers",
  },
  {
    name: "Moving & Transport",
    slug: "movers",
    icon: Truck,
    color: "text-rose-600",
    bg: "bg-rose-50",
    count: "90+ providers",
  },
  {
    name: "Handyman",
    slug: "carpenter",
    icon: Hammer,
    color: "text-orange-600",
    bg: "bg-orange-50",
    count: "100+ providers",
  },
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

export function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const handleDashboardSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/client/search", search: { q: searchVal || undefined } as any });
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["clientDashboardData", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Query bookings
      const bookingsQuery = supabase
        .from("bookings")
        .select(
          "id, status, scheduled_at, total_price, provider:organizations(id, name, created_by), service:provider_services(name)",
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

      // Query top 3 contractors for AI matches
      const contractorsQuery = supabase
        .from("contractors")
        .select(
          `
          id,
          name,
          hourly_rate,
          specialty,
          organization:organizations(
            id,
            reviews(rating),
            bookings(id, status)
          )
        `,
        )
        .limit(3);

      const [bookingsRes, tendersRes, reviewsRes, messagesRes, contractorsRes] = await Promise.all([
        bookingsQuery,
        tendersQuery,
        reviewsQuery,
        messagesQuery,
        contractorsQuery,
      ]);

      const bookings = bookingsRes.data || [];
      const tenders = tendersRes.data || [];
      const reviews = reviewsRes.data || [];
      const unreadCount = messagesRes.count || 0;
      const contractors = contractorsRes.data || [];

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
      const upcoming = bookings.filter(
        (b) =>
          (b.status === "confirmed" || b.status === "pending") &&
          new Date(b.scheduled_at).getTime() >= Date.now(),
      );

      // Find completed or cancelled bookings
      const completed = bookings.filter((b) => b.status === "completed");
      const pending = bookings.filter((b) => b.status === "pending");

      // Calculate dynamic matched providers
      const convertedContractors = contractors.map((c: any) => {
        const org = c.organization;
        const reviewsList = org?.reviews || [];
        const bookingsList = org?.bookings || [];

        const rating =
          reviewsList.length > 0
            ? Number(
                (
                  reviewsList.reduce((sum: number, r: any) => sum + r.rating, 0) /
                  reviewsList.length
                ).toFixed(1),
              )
            : null;

        return {
          id: c.id,
          name: c.name,
          specialty: c.specialty || "Contractor",
          hourlyRate: Number(c.hourly_rate || 90),
          rating,
          reviewsCount: reviewsList.length,
          jobsCompleted: bookingsList.filter((b: any) => b.status === "completed").length,
        };
      });

      return {
        bookings,
        tenders,
        chartData,
        upcoming,
        completed,
        pending,
        stats: {
          totalBookings: bookings.length,
          totalSpent: spent,
          avgRating,
          unreadCount,
        },
        aiMatches: convertedContractors,
      };
    },
  });

  const stats = dashboardData?.stats;
  const bookingCount = stats?.totalBookings ?? 0;
  const totalSpent = stats?.totalSpent ?? 0;
  const avgRating = stats?.avgRating ?? 0;
  const unreadCount = stats?.unreadCount ?? 0;
  const chartData = dashboardData?.chartData || [];
  const upcomingBookings = dashboardData?.upcoming || [];
  const completedCount = dashboardData?.completed?.length ?? 0;
  const pendingCount = dashboardData?.pending?.length ?? 0;

  // Build dynamic notifications
  const dynamicNotifications = (dashboardData?.bookings || []).slice(0, 3).map((b) => {
    let message = "";
    const timeStr = "Just now";

    if (b.status === "pending") {
      message = `Booking request for ${(b.service as any)?.name || "Service"} is pending approval.`;
    } else if (b.status === "confirmed") {
      message = `Booking with ${(b.provider as any)?.name || "Provider"} is confirmed.`;
    } else if (b.status === "completed") {
      message = `Completed service with ${(b.provider as any)?.name || "Provider"}.`;
    } else {
      message = `Service status updated to ${b.status}.`;
    }

    return { id: b.id, message, timeStr };
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* ── 1. GREETING & NEW BOOKING ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, {firstName}!
            <span className="inline-block text-2xl animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Here's what's happening with your bookings.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/client/search" })}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 h-10 shadow-lg shadow-blue-600/15 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      {/* ── 2. TOP ROW KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Calendar,
            label: "Upcoming Bookings",
            value: upcomingBookings.length,
            bg: "bg-blue-50",
            color: "text-blue-600",
            link: "/client/bookings",
            hoverBorder: "hover:border-blue-200",
          },
          {
            icon: Clock,
            label: "Pending Requests",
            value: pendingCount,
            bg: "bg-amber-50",
            color: "text-amber-600",
            link: "/client/bookings",
            hoverBorder: "hover:border-amber-200",
          },
          {
            icon: CheckCircle2,
            label: "Completed Bookings",
            value: completedCount,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            link: "/client/bookings",
            hoverBorder: "hover:border-emerald-200",
          },
          {
            icon: Wallet,
            label: "Total Spent",
            value: `CHF ${totalSpent.toLocaleString("en-CH")}`,
            bg: "bg-indigo-50",
            color: "text-indigo-600",
            link: "/payments",
            hoverBorder: "hover:border-indigo-200",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            onClick={() => navigate({ to: kpi.link as any })}
            className={cn(
              "bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
              kpi.hoverBorder,
            )}
          >
            <div className="flex justify-between items-start">
              <div
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                  kpi.bg,
                )}
              >
                <kpi.icon className={cn("h-4.5 w-4.5", kpi.color)} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-0.5">
                View all <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-400">{kpi.label}</div>
              <div className="text-xl font-black text-slate-900 mt-1 leading-none">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. MAIN CONTENT GRID (LEFT/SIDEBAR SPLIT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT COLUMN (MAIN CARDS) */}
        <div className="space-y-6">
          {/* Upcoming Bookings list */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-950">Upcoming Bookings</h3>
              <button
                onClick={() => navigate({ to: "/client/calendar" })}
                className="text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors"
              >
                View Calendar
              </button>
            </div>
            <div className="p-2">
              {isLoading ? (
                <div className="text-slate-400 text-xs text-center py-10">Loading bookings...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">No upcoming bookings</p>
                    <p className="text-[11px] text-slate-400">
                      Find a provider to request a home service.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingBookings.slice(0, 3).map((booking: any) => (
                    <div
                      key={booking.id}
                      onClick={() => navigate({ to: "/client/bookings" })}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-500 border border-slate-200">
                          {booking.provider?.name?.charAt(0) || "P"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {(booking.service as any)?.name || "General Service"}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-medium">
                            <span>{booking.provider?.name}</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center text-amber-500 font-semibold gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500" />
                              4.8
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {new Date(booking.scheduled_at).toLocaleDateString("en-CH", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {new Date(booking.scheduled_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>Zürich, Switzerland</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-md border",
                            booking.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-100",
                          )}
                        >
                          {booking.status}
                        </span>
                        <button className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {upcomingBookings.length > 3 && (
              <div className="p-3 text-center border-t border-slate-100">
                <button
                  onClick={() => navigate({ to: "/client/bookings" })}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All Bookings
                </button>
              </div>
            )}
          </div>

          {/* Explore Popular Services */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950">Explore Popular Services</h3>
              <button
                onClick={() => navigate({ to: "/client/search" })}
                className="text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors"
              >
                View all categories
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => navigate({ to: "/client/search", search: { q: cat.slug } as any })}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-blue-150 hover:bg-blue-50/10 hover:shadow-sm transition-all group text-left cursor-pointer"
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                      cat.bg,
                    )}
                  >
                    <cat.icon className={cn("h-4.5 w-4.5", cat.color)} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                      {cat.count}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-6">
          {/* AI Match for You */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950">AI Match for You</h3>
              <button
                onClick={() => navigate({ to: "/client/ai-match" })}
                className="text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {(dashboardData?.aiMatches || []).map((provider: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 font-bold text-slate-600 text-xs">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{provider.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />
                          {provider.rating || "New"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          CHF {provider.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate({ to: `/client/providers/${provider.id}` })}
                    className="h-7 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[10px] font-bold shrink-0 shadow-sm cursor-pointer transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate({ to: "/client/ai-match" })}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors block w-full text-center"
            >
              See more matches →
            </button>
          </div>

          {/* Spending Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950">Your Spending Overview</h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                This Month ▾
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">
                  CHF {totalSpent.toLocaleString("en-CH")}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  + 16% from last month
                </span>
              </div>
            </div>
            <div className="h-[120px] w-full mt-2 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorAmount)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
